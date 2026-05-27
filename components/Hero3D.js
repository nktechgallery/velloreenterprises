'use client';
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

function FireExtinguisher({ isMobile }) {
  const group = useRef();
  const [loaded, setLoaded] = useState(false);

  let gltf;
  try {
    gltf = useGLTF('/fire.glb');
  } catch {}

  useFrame((state) => {
    if (group.current && !loaded) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  if (!gltf) return <FireExtinguisherFallback isMobile={isMobile} />;

  const scale = isMobile ? 0.8 : 1.2;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={group} scale={[scale, scale, scale]} position={[0, -0.5, 0]}>
        <primitive object={gltf.scene} />
      </group>
    </Float>
  );
}

// Procedural fire extinguisher as fallback
function FireExtinguisherFallback({ isMobile }) {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  const s = isMobile ? 0.85 : 1;

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.5}>
      <group ref={group} scale={[s, s, s]}>
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.38, 1.8, 32]} />
          <meshStandardMaterial color="#CC2200" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Top dome */}
        <mesh position={[0, 0.96, 0]} castShadow>
          <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#CC2200" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Bottom */}
        <mesh position={[0, -0.95, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.35, 0.1, 32]} />
          <meshStandardMaterial color="#991900" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.2, 0.3, 24]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Valve head */}
        <mesh position={[0, 1.32, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.12, 0.2, 24]} />
          <meshStandardMaterial color="#666" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, 1.35, 0.22]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.06, 0.5]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Lever */}
        <mesh position={[0, 1.45, -0.15]} rotation={[-Math.PI / 5, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.45]} />
          <meshStandardMaterial color="#C9A227" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Hose */}
        <mesh position={[-0.25, 0.3, 0.3]} rotation={[0.5, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        {/* Nozzle */}
        <mesh position={[-0.4, 0.1, 0.5]} rotation={[0.8, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.05, 0.03, 0.25, 12]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Label band */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.352, 0.352, 0.8, 32]} />
          <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
        </mesh>
        {/* Pressure gauge */}
        <mesh position={[0.36, 0.5, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ddd" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Gold ring accent */}
        <mesh position={[0, -0.9, 0]}>
          <torusGeometry args={[0.38, 0.015, 8, 32]} />
          <meshStandardMaterial color="#C9A227" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.35, 0.015, 8, 32]} />
          <meshStandardMaterial color="#C9A227" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({ isMobile }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#C9A227" />
      <pointLight position={[3, -1, 3]} intensity={0.4} color="#FF4400" />
      <spotLight position={[0, 6, 0]} intensity={0.6} angle={0.5} penumbra={0.8} color="#fff5e0" />
      <FireExtinguisher isMobile={isMobile} />
      <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={4} blur={2} far={3} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={false}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
      <Environment preset="city" />
    </>
  );
}

function WebGLCheck({ children }) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch { setWebglSupported(false); }
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img
          src="/images/extinguisher-fallback.jpg"
          alt="Fire extinguisher"
          className="max-h-full object-contain"
        />
      </div>
    );
  }

  return children;
}

export default function Hero3D() {
  const [isMobile, setIsMobile] = useState(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const pixelRatio = window.devicePixelRatio || 1;
      setDpr(mobile ? Math.min(pixelRatio, 1.5) : Math.min(pixelRatio, 2));
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="w-full h-full canvas-container" aria-label="Interactive 3D fire extinguisher model. Drag to rotate.">
      <WebGLCheck>
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 0, 4], fov: isMobile ? 55 : 45 }}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
          shadows
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <Scene isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </WebGLCheck>
    </div>
  );
}

useGLTF.preload('/fire.glb');
