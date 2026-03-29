"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, MeshReflectorMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// ── Screen texture (canvas-drawn) ────────────────────────────────────────────

function useScreenTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, 1024);
    bg.addColorStop(0, "#0a0a14");
    bg.addColorStop(0.5, "#10101e");
    bg.addColorStop(1, "#080810");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 1024);

    // Subtle wallpaper glow
    const glow = ctx.createRadialGradient(256, 720, 0, 256, 720, 400);
    glow.addColorStop(0, "rgba(100,100,220,0.3)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 512, 1024);

    // Time display
    ctx.font = "bold 96px -apple-system,sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.textAlign = "center";
    ctx.fillText("9:41", 256, 260);

    // Date
    ctx.font = "300 32px -apple-system,sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.50)";
    ctx.fillText("Saturday, March 28", 256, 310);

    // App icons grid
    const icons = [
      "#ef4444","#3b82f6","#22c55e","#f59e0b",
      "#8b5cf6","#06b6d4","#f97316","#ec4899",
      "#10b981","#6366f1","#14b8a6","#a855f7",
    ];
    const cols = 4, rows = 3;
    const iconSize = 72, gap = 24;
    const startX = (512 - (cols * iconSize + (cols-1) * gap)) / 2;
    const startY = 420;
    icons.forEach((color, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * (iconSize + gap);
      const y = startY + row * (iconSize + gap + 8);
      ctx.beginPath();
      ctx.roundRect(x, y, iconSize, iconSize, 18);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Dynamic Island
    ctx.beginPath();
    ctx.roundRect(180, 32, 152, 34, 17);
    ctx.fillStyle = "#000000";
    ctx.fill();

    // Home indicator
    ctx.beginPath();
    ctx.roundRect(192, 984, 128, 5, 3);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
}

// ── iPhone mesh ───────────────────────────────────────────────────────────────

function PhoneMesh({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const screenTexture = useScreenTexture();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const scroll = scrollY.current;

    // Idle float
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.04;

    // Scroll-driven rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      scroll * Math.PI * 0.8 - 0.3,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      scroll * 0.18,
      0.05
    );
  });

  return (
    <group ref={groupRef} rotation={[0.06, -0.28, 0]}>
      {/* Body — titanium silver */}
      <RoundedBox args={[1.1, 2.28, 0.11]} radius={0.08} smoothness={8}>
        <meshPhysicalMaterial
          color="#c8c8d0"
          metalness={0.85}
          roughness={0.12}
          reflectivity={0.9}
          clearcoat={0.6}
          clearcoatRoughness={0.08}
          envMapIntensity={1.8}
        />
      </RoundedBox>

      {/* Screen glass */}
      <mesh position={[0, 0, 0.057]}>
        <planeGeometry args={[0.98, 2.14]} />
        <meshPhysicalMaterial
          map={screenTexture}
          transparent
          opacity={1}
          roughness={0.04}
          metalness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Screen bezel (black rounded rect slightly larger) */}
      <mesh position={[0, 0, 0.054]}>
        <planeGeometry args={[1.02, 2.18]} />
        <meshPhysicalMaterial color="#050508" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Glass gloss streak */}
      <mesh position={[-0.15, 0.55, 0.058]} rotation={[0, 0, -0.45]}>
        <planeGeometry args={[0.5, 1.1]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.07}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Side button */}
      <mesh position={[0.558, 0.35, 0]}>
        <boxGeometry args={[0.012, 0.32, 0.06]} />
        <meshPhysicalMaterial color="#b8b8c2" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Volume up */}
      <mesh position={[-0.558, 0.3, 0]}>
        <boxGeometry args={[0.012, 0.2, 0.055]} />
        <meshPhysicalMaterial color="#b8b8c2" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Volume down */}
      <mesh position={[-0.558, 0.02, 0]}>
        <boxGeometry args={[0.012, 0.2, 0.055]} />
        <meshPhysicalMaterial color="#b8b8c2" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Back camera bump */}
      <mesh position={[-0.28, 0.75, -0.06]}>
        <boxGeometry args={[0.42, 0.42, 0.025]} />
        <meshPhysicalMaterial color="#b0b0b8" metalness={0.88} roughness={0.1} />
      </mesh>
      {/* Camera lenses */}
      {[[-0.11, 0.11], [0.11, 0.11], [-0.11, -0.11]].map(([cx, cy], i) => (
        <mesh key={i} position={[-0.28 + cx, 0.75 + cy, -0.048]}>
          <cylinderGeometry args={[0.07, 0.07, 0.018, 32]} />
          <meshPhysicalMaterial color="#111118" metalness={0.5} roughness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

// ── Reflective floor ──────────────────────────────────────────────────────────

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
      <planeGeometry args={[12, 12]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={0.35}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#f5f5f7"
        metalness={0.1}
        mirror={0}
      />
    </mesh>
  );
}

// ── Camera rig ────────────────────────────────────────────────────────────────

function CameraRig({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -scrollY.current * 0.4, 0.04);
  });
  return null;
}

// ── Scene ─────────────────────────────────────────────────────────────────────

function Scene({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <fog attach="fog" args={["#ffffff", 6, 14]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 3]} intensity={2.5} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.8} color="#e8e8ff" />
      <pointLight position={[0, 3, 2]} intensity={1.2} color="#ffffff" />
      <Environment preset="city" />
      <CameraRig scrollY={scrollY} />
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.2}>
        <PhoneMesh scrollY={scrollY} />
      </Float>
      <Floor />
    </>
  );
}

// ── Exported component ────────────────────────────────────────────────────────

export default function Phone3D({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 3.8], fov: 36 }}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: false }}
    >
      <Scene scrollY={scrollY} />
    </Canvas>
  );
}
