"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function SceneCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [fragReady, setFragReady] = useState(false);
  const [fragError, setFragError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    import("@thatopen/fragments")
      .then(() => {
        if (mounted) {
          setFragReady(true);
        }
      })
      .catch((error) => {
        if (mounted) {
          setFragError(error instanceof Error ? error.message : String(error));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const mountNode = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030711");

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      2000,
    );
    camera.position.set(60, 40, 60);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.shadowMap.enabled = true;
    mountNode.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambient = new THREE.AmbientLight(0xb2f5ea, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(40, 60, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const grid = new THREE.GridHelper(200, 20, 0x1f2937, 0x111827);
    scene.add(grid);

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.8,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.8,
      }),
    ];

    const blocks = [
      new THREE.BoxGeometry(16, 24, 12),
      new THREE.BoxGeometry(12, 16, 12),
      new THREE.BoxGeometry(10, 30, 10),
    ];

    blocks.forEach((geo, index) => {
      const mesh = new THREE.Mesh(geo, materials[index % materials.length]);
      mesh.position.set(index * 18 - 18, geo.parameters.height / 2, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    let animationFrame: number;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountNode) return;
      const { clientWidth, clientHeight } = mountNode;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      mountNode?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="flex-1 rounded-2xl" />
      <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/70">
        <span>
          {fragReady
            ? "FRAG engine primed – awaiting LivingTwin stream"
            : "Loading FRAG runtime…"}
        </span>
        {fragError && <span className="text-rose-300">{fragError}</span>}
      </div>
    </div>
  );
}

