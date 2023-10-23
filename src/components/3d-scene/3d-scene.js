import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';

import { env } from '../../js/modules/env';
import { emitter } from '../../js/modules/event-emitter';

import BackgroundPlane from './background-plane/background-plane';
import Molecule from './molecule/molecule';

const CAMERA_DISTANCE = 1000;

function Scene() {
  const three = useThree();
  const light = useRef(/** @type {THREE.PointLight | null} */ (null));
  const moleculeRef = useRef(/** @type {Molecule | null} */ (null));
  const [experienceStarted, setExperienceStarted] = React.useState(false);

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

  React.useEffect(() => {
    emitter.on('experience-started', () => {
      gsap.to(moleculeRef.current?.position, {
        duration: 1,
        x: 0,
      });
      gsap.to(moleculeRef.current?.scale, {
        duration: 0.8,
        x: 1,
        y: 1,
        z: 1,
      });
      gsap.to(moleculeRef.current?.rotation, {
        duration: 0.6,
        x: 0,
        y: 0,
        z: 0,
        onComplete: () => {
          setExperienceStarted(true);
        },
        ease: 'power1.out',
      });
    });
  }, []);

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();
    const x = Math.sin(elapsedTime * 1.1) * 200;
    const y = Math.cos(elapsedTime * 1.1) * 200;

    if (light.current) {
      light.current.position.x = x;
      light.current.position.y = y;
    }

    if (moleculeRef.current && experienceStarted) {
      moleculeRef.current.rotation.y += delta * 0.5;
      moleculeRef.current.rotation.x += delta * 0.5;
      moleculeRef.current.rotation.z = Math.sin(moleculeRef.current.rotation.y);

      // moleculeRef.current.position.x = Math.sin(moleculeRef.current.rotation.y);
      // moleculeRef.current.position.y = Math.sin(moleculeRef.current.rotation.y);
      // moleculeRef.current.position.z = Math.sin(moleculeRef.current.rotation.y);
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
      <Molecule
        ref={moleculeRef}
        position={[-400, 0, 0]}
        rotation={[0, 0, -Math.PI]}
        scale={1.6}
      />
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
