"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type DuoModelProps = {
  progressRef: RefObject<number>;
  interactive?: boolean;
};

export function DuoModel({ progressRef, interactive = false }: DuoModelProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(0, 0.1, 8.2);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    scene.add(new THREE.HemisphereLight(0xfff1e7, 0x2c1715, 2.8));
    const key = new THREE.DirectionalLight(0xffffff, 4.8);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe9896e, 3.2);
    rim.position.set(5, 1, -3);
    scene.add(rim);

    const stage = new THREE.Group();
    scene.add(stage);
    const normalizedModel = new THREE.Group();
    stage.add(normalizedModel);

    let model: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let clipDuration = 1;
    let pointerX = 0;
    let pointerY = 0;
    let dragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let renderedX = 0;
    let renderedY = 0;
    let disposed = false;
    let visible = true;

    const loader = new GLTFLoader();
    loader.load(
      "/assets/products/duo/iphone-duo-lite.gltf",
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        model.rotation.x = Math.PI / 2;
        normalizedModel.add(model);

        const screenCanvas = document.createElement("canvas");
        screenCanvas.width = 1024;
        screenCanvas.height = 1024;
        const context = screenCanvas.getContext("2d");
        if (context) {
          const fill = context.createLinearGradient(0, 0, 1024, 1024);
          fill.addColorStop(0, "#2a1015");
          fill.addColorStop(0.48, "#8f2f3e");
          fill.addColorStop(1, "#ef8a68");
          context.fillStyle = fill;
          context.fillRect(0, 0, 1024, 1024);
          context.fillStyle = "rgba(255,226,207,.78)";
          context.beginPath();
          context.arc(760, 240, 96, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = "rgba(70,12,26,.72)";
          context.beginPath();
          context.arc(260, 720, 190, 0, Math.PI * 2);
          context.fill();
        }
        const screenTexture = new THREE.CanvasTexture(screenCanvas);
        screenTexture.colorSpace = THREE.SRGBColorSpace;
        screenTexture.flipY = false;
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (!(material instanceof THREE.MeshStandardMaterial)) return;
            if (material.name.includes("screenTexture") || material.name === "pkUBCyCvYJYVzTr") {
              material.map = screenTexture;
              material.emissiveMap = screenTexture;
              material.emissive.set(0xffffff);
              material.emissiveIntensity = 0.62;
              material.needsUpdate = true;
            }
          });
        });

        const clip = gltf.animations.find((item) => item.name === "Slider") ?? gltf.animations[0];
        if (clip) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(clip);
          action.play();
          clipDuration = clip.duration;
          mixer.setTime(0);
          model.updateMatrixWorld(true);
        }

        const box = new THREE.Box3().setFromObject(model);
        if (mixer) {
          mixer.setTime(clipDuration);
          model.updateMatrixWorld(true);
          box.union(new THREE.Box3().setFromObject(model));
        }
        const centre = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(centre);
        normalizedModel.scale.setScalar(3.25 / Math.max(size.x, size.y, size.z));
        if (mixer) mixer.setTime(clipDuration);
        host.classList.add("is-ready");
      },
      undefined,
      () => host.classList.add("has-error"),
    );

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 1 ? 11.2 : 8.2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { rootMargin: "120px" });
    visibilityObserver.observe(host);
    resize();

    const onPointerMove = (event: PointerEvent) => {
      if (interactive) {
        if (!dragging) return;
        pointerX += (event.clientX - lastPointerX) * 0.009;
        pointerY = THREE.MathUtils.clamp(pointerY + (event.clientY - lastPointerY) * 0.006, -0.55, 0.55);
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        return;
      }
      const bounds = host.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.16;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.08;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!interactive) return;
      dragging = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      host.setPointerCapture(event.pointerId);
      host.classList.add("is-dragging");
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!interactive) return;
      dragging = false;
      if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
      host.classList.remove("is-dragging");
    };
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);

    let frame = 0;
    const draw = () => {
      frame = window.requestAnimationFrame(draw);
      if (mixer) mixer.setTime(clipDuration * (1 - Math.min(1, Math.max(0, progressRef.current)) * 0.5));
      renderedX += (pointerX - renderedX) * 0.06;
      renderedY += (pointerY - renderedY) * 0.06;
      stage.rotation.y = renderedX;
      stage.rotation.x = renderedY;
      if (visible) renderer.render(scene, camera);
    };
    draw();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      if (model) {
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => value instanceof THREE.Texture && value.dispose());
            material.dispose();
          });
        });
      }
      mixer?.stopAllAction();
      renderer.dispose();
    };
  }, [interactive, progressRef]);

  return (
    <div ref={hostRef} className={interactive ? "duo-model-shell is-interactive" : "duo-model-shell"} aria-label="Interactive 3D iPhone Duo model opening from folded to unfolded" role="img">
      <canvas ref={canvasRef} />
      <span className="duo-model-loader">Loading product</span>
    </div>
  );
}
