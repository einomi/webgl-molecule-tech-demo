import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { Suspense } from 'react';

function Mesh() {
  const meshRef = useRef(/** @type {THREE.Mesh | null} */ (null));
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // use frame, rotate mesh
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      meshRef.current.rotation.x = meshRef.current.rotation.y;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(_event) => setActive(!active)}
      onPointerOver={(_event) => setHover(true)}
      onPointerOut={(_event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

function Scene() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Mesh />
    </Canvas>
  );
}

export default Scene;
