import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

import { env } from '../../js/modules/env';

import BackgroundPlane from './background-plane/background-plane';
import Molecule from './molecule/molecule';

const CAMERA_DISTANCE = 1000;

function Scene() {
  const three = useThree();
  const light = useRef(/** @type {THREE.PointLight | null} */ (null));
  const light2 = useRef(/** @type {THREE.PointLight | null} */ (null));

  React.useEffect(() => {
    const camera = /** @type {THREE.PerspectiveCamera} */ (three.camera);
    camera.near = 0.1;
    camera.far = 10000;
    camera.position.z = CAMERA_DISTANCE;
    camera.fov =
      2 *
      Math.atan(env.viewportResolution.value.height / 2 / CAMERA_DISTANCE) *
      (180 / Math.PI);
    camera.updateProjectionMatrix();
  }, []);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const x = Math.sin(elapsedTime * 1.1) * 200;
    const y = Math.cos(elapsedTime * 1.1) * 200;

    if (light.current) {
      light.current.position.x = x;
      light.current.position.y = y;
    }

    if (light2.current) {
      light2.current.position.x = x;
      light2.current.position.y = y;
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} color="white" />
      <pointLight
        ref={light}
        position={[30, 20, 10]}
        intensity={5000}
        color="#85a2ee"
      />
      <BackgroundPlane />
      <Molecule />
    </>
  );
}

function SceneWrapper() {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
}

export default SceneWrapper;
