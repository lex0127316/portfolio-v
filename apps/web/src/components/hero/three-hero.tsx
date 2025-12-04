"use client";

import * as React from "react";
import * as THREE from "three";
import { THEME_TRANSITION_END_EVENT, THEME_TRANSITION_START_EVENT } from "@/lib/theme";

export function HeroScene() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    const parent = canvas.parentElement ?? canvas;
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const coreGeometry = new THREE.IcosahedronGeometry(2.1, 2);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#8ec5ff"),
      roughness: 0.12,
      metalness: 0.35,
      transmission: 0.65,
      thickness: 1.2,
      iridescence: 0.65,
      iridescenceIOR: 1.2,
      emissive: new THREE.Color("#2563eb"),
      emissiveIntensity: 0.45,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);

    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.35, 1)),
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#60a5fa"),
        transparent: true,
        opacity: 0.35,
      }),
    );

    const createRing = (radius: number, tilt: number, color: string) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.02, 32, 256),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.55,
        }),
      );
      ring.rotation.set(Math.PI / 2.4, tilt, 0);
      return ring;
    };

    const ringA = createRing(3.2, 0.2, "#a78bfa");
    const ringB = createRing(2.7, -0.3, "#38bdf8");

    const group = new THREE.Group();
    group.add(core, wireframe, ringA, ringB);
    scene.add(group);

    const starCount = 900;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      starPositions.set([x, y, z], i * 3);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      color: new THREE.Color("#c7d2fe"),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    const ambient = new THREE.AmbientLight(0xfef5ff, 0.8);
    const key = new THREE.DirectionalLight(0x93c5fd, 1.4);
    key.position.set(3, 2, 5);
    const rim = new THREE.PointLight(0xf472b6, 1.2);
    rim.position.set(-4, -2, -6);
    const fill = new THREE.PointLight(0x22d3ee, 0.9);
    fill.position.set(2, -1, 3);

    scene.add(ambient, key, rim, fill);

    const setRendererSize = (width?: number, height?: number) => {
      const nextWidth = Math.max(1, width ?? parent.clientWidth ?? 1);
      const nextHeight = Math.max(1, height ?? parent.clientHeight ?? 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(nextWidth, nextHeight, false); // keep DOM sizing in CSS to avoid observer loops
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };

    const resize = () => setRendererSize();

    resize();
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      setRendererSize(entry.contentRect.width, entry.contentRect.height);
    });
    resizeObserver.observe(parent);

    let frameId: number | null = null;
    let isVisible = true;
    let isTransitioning = false;
    const clock = new THREE.Clock();
    const targetRotation = new THREE.Vector2();

    const handlePointerMove = (event: PointerEvent) => {
      if (!parent) {
        return;
      }
      const rect = parent.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      targetRotation.x = (0.5 - y) * 0.35;
      targetRotation.y = (x - 0.5) * 0.45;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const animate = () => {
      if (!isVisible) {
        frameId = null;
        return;
      }
      const elapsed = clock.getElapsedTime();
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.05;

      const pulse = 1 + Math.sin(elapsed * 1.1) * 0.08;
      core.rotation.x = elapsed * 0.3;
      core.rotation.y = elapsed * 0.4;
      core.scale.setScalar(pulse);

      ringA.rotation.z = elapsed * 0.15;
      ringB.rotation.z = -elapsed * 0.12;

      starField.rotation.y = elapsed * 0.02;
      starField.rotation.x = Math.sin(elapsed * 0.1) * 0.04;

      coreMaterial.emissiveIntensity = 0.4 + Math.sin(elapsed * 0.9) * 0.2;
      (wireframe.material as THREE.LineBasicMaterial).opacity = 0.25 + Math.sin(elapsed * 1.6) * 0.08;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frameId && !isTransitioning) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        start();
      } else {
        stop();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && !document.hidden;
        if (isVisible) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(canvas.parentElement ?? canvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleTransitionStart = () => {
      isTransitioning = true;
      stop();
    };

    const handleTransitionEnd = () => {
      isTransitioning = false;
      if (isVisible) {
        start();
      }
    };

    window.addEventListener(THEME_TRANSITION_START_EVENT, handleTransitionStart);
    window.addEventListener(THEME_TRANSITION_END_EVENT, handleTransitionEnd);

    start();

    return () => {
      stop();
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener(THEME_TRANSITION_START_EVENT, handleTransitionStart);
      window.removeEventListener(THEME_TRANSITION_END_EVENT, handleTransitionEnd);
      coreGeometry.dispose();
      coreMaterial.dispose();
      (wireframe.geometry as THREE.EdgesGeometry).dispose();
      (wireframe.material as THREE.LineBasicMaterial).dispose();
      ringA.geometry.dispose();
      ringB.geometry.dispose();
      (ringA.material as THREE.MeshBasicMaterial).dispose();
      (ringB.material as THREE.MeshBasicMaterial).dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="size-full"
      role="presentation"
    />
  );
}

