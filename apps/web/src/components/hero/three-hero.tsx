"use client";

import * as React from "react";
import * as THREE from "three";

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
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) {
        frameId = null;
        return;
      }
      const elapsed = clock.getElapsedTime();
      mesh.rotation.x = elapsed * 0.25;
      mesh.rotation.y = elapsed * 0.35;
      mesh.position.y = Math.sin(elapsed * 0.7) * 0.25;

      material.emissiveIntensity = 0.4 + Math.sin(elapsed * 0.8) * 0.1;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frameId) {
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

    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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

