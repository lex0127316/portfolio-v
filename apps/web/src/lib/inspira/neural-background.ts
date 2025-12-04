"use client";

import { Camera, Mesh, Plane, Program, Renderer, Transform } from "ogl";

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

export type NeuralBackgroundOptions = {
  hue?: number;
  saturation?: number;
  chroma?: number;
};

export type NeuralBackgroundController = {
  setHue: (value: number) => void;
  setSaturation: (value: number) => void;
  setChroma: (value: number) => void;
  destroy: () => void;
};

const vertexShader = `
  precision mediump float;

  attribute vec2 position;
  attribute vec2 uv;

  varying vec2 vUv;

  void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;

  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform float u_scroll_progress;
  uniform float u_hue;
  uniform float u_saturation;
  uniform float u_chroma;

  vec2 rotate(vec2 uv, float th) {
      return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }

  float neuro_shape(vec2 uv, float t, float p) {
      vec2 sine_acc = vec2(0.);
      vec2 res = vec2(0.);
      float scale = 8.;

      for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
      }
      return res.x + res.y;
  }

  vec3 hsl2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
      return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }

  void main() {
      vec2 uv = .5 * vUv;
      uv.x *= u_ratio;

      vec2 pointer = vUv - u_pointer_position;
      pointer.x *= u_ratio;
      float p = clamp(length(pointer), 0., 1.);
      p = .5 * pow(1. - p, 2.);

      float t = .001 * u_time;
      vec3 color = vec3(0.);

      float noise = neuro_shape(uv, t, p);

      noise = 1.2 * pow(noise, 3.);
      noise += pow(noise, 10.);
      noise = max(.0, noise - .5);
      noise *= (1. - length(vUv - .5));

      float normalizedHue = u_hue / 360.0;

      vec3 hsl = vec3(
          normalizedHue + 0.1 * sin(3.0 * u_scroll_progress + 1.5),
          u_saturation,
          u_chroma * 0.5 + 0.2 * sin(2.0 * u_scroll_progress)
      );

      color = hsl2rgb(hsl);
      color = color * noise;

      gl_FragColor = vec4(color, noise);
  }
`;

export function createNeuralBackground(
  canvas: HTMLCanvasElement | null,
  { hue = 200, saturation = 0.8, chroma = 0.6 }: NeuralBackgroundOptions = {},
): NeuralBackgroundController | null {
  if (!canvas || typeof window === "undefined") {
    return null;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    canvas.style.display = "none";
    return null;
  }

  const pointer: PointerState = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
  };

  let renderer: Renderer | null = null;
  let camera: Camera | null = null;
  let scene: Transform | null = null;
  let mesh: Mesh | null = null;
  let animationFrame: number | null = null;
  let resizeObserver: ResizeObserver | null = null;

  const handlePointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);
  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches[0]) {
      updatePointer(event.touches[0].clientX, event.touches[0].clientY);
    }
  };
  const handleClick = (event: MouseEvent) => updatePointer(event.clientX, event.clientY);

  const updatePointer = (x: number, y: number) => {
    pointer.targetX = x;
    pointer.targetY = y;
  };

  const initOGL = () => {
    try {
      renderer = new Renderer({
        canvas,
        width: canvas.clientWidth || window.innerWidth,
        height: canvas.clientHeight || window.innerHeight,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });

      camera = new Camera(renderer.gl);
      scene = new Transform();
      const geometry = new Plane(renderer.gl, { width: 2, height: 2 });
      const program = new Program(renderer.gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          u_time: { value: 0 },
          u_ratio: { value: window.innerWidth / window.innerHeight },
          u_pointer_position: { value: [0, 0] },
          u_scroll_progress: { value: 0 },
          u_hue: { value: hue },
          u_saturation: { value: saturation },
          u_chroma: { value: chroma },
        },
      });

      mesh = new Mesh(renderer.gl, { geometry, program });
      mesh.setParent(scene);
      return true;
    } catch (error) {
      console.error("Failed to initialize NeuralBg", error);
      return false;
    }
  };

  const resizeCanvas = () => {
    if (!renderer || !mesh || !canvas) {
      return;
    }
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight || 1;
    renderer.setSize(width, height);
    if (mesh.program?.uniforms?.u_ratio) {
      mesh.program.uniforms.u_ratio.value = width / height;
    }
  };

  const render = () => {
    if (!renderer || !scene || !camera || !mesh) {
      return;
    }

    pointer.x += (pointer.targetX - pointer.x) * 0.2;
    pointer.y += (pointer.targetY - pointer.y) * 0.2;

    const uniforms = mesh.program?.uniforms;
    const currentTime = performance.now();

    if (uniforms?.u_time) {
      uniforms.u_time.value = currentTime;
    }
    if (uniforms?.u_pointer_position) {
      uniforms.u_pointer_position.value = [
        pointer.x / window.innerWidth,
        1 - pointer.y / window.innerHeight,
      ];
    }
    if (uniforms?.u_scroll_progress) {
      uniforms.u_scroll_progress.value =
        window.scrollY / (2 * Math.max(window.innerHeight, 1));
    }

    renderer.render({ scene, camera });
    animationFrame = requestAnimationFrame(render);
  };

  if (!initOGL()) {
    return null;
  }

  resizeCanvas();
  animationFrame = requestAnimationFrame(render);

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  window.addEventListener("click", handleClick);
  window.addEventListener("resize", resizeCanvas);

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => requestAnimationFrame(resizeCanvas));
    resizeObserver.observe(canvas);
  }

  const setUniform = (uniform: "u_hue" | "u_saturation" | "u_chroma", value: number) => {
    if (mesh?.program?.uniforms?.[uniform]) {
      mesh.program.uniforms[uniform].value = value;
    }
  };

  const destroy = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("click", handleClick);
    window.removeEventListener("resize", resizeCanvas);
    resizeObserver?.disconnect();

    renderer = null;
    camera = null;
    scene = null;
    mesh = null;
  };

  return {
    setHue: (value: number) => setUniform("u_hue", value),
    setSaturation: (value: number) => setUniform("u_saturation", value),
    setChroma: (value: number) => setUniform("u_chroma", value),
    destroy,
  };
}


