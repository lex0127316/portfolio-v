"use client";

import * as React from "react";
import * as THREE from "three";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HeroScene() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 6;

    const geometry = new THREE.IcosahedronGeometry(2.2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#5b8dff"),
      roughness: 0.25,
      metalness: 0.9,
      emissive: new THREE.Color("#2563eb"),
      emissiveIntensity: 0.5,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const key = new THREE.DirectionalLight(0x93c5fd, 1.2);
    key.position.set(3, 2, 5);
    const rim = new THREE.PointLight(0xf472b6, 1);
    rim.position.set(-4, -2, -6);

    scene.add(ambient, key, rim);

    const resize = () => {
      const { clientWidth, clientHeight } = canvas.parentElement ?? canvas;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement ?? canvas);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      mesh.rotation.x = elapsed * 0.25;
      mesh.rotation.y = elapsed * 0.35;
      mesh.position.y = Math.sin(elapsed * 0.7) * 0.25;

      material.emissiveIntensity = 0.4 + Math.sin(elapsed * 0.8) * 0.1;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
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

