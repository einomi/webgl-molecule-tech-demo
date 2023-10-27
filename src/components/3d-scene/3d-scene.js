import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';

import { env } from '../../js/modules/env';
import { emitter } from '../../js/modules/event-emitter';

import BackgroundPlane from './background-plane/background-plane';
import Molecule from './molecule/molecule';

const CAMERA_DISTANCE = 1100;
const INITIAL_X_POSITION = env.isMobile ? -200 : -300;

const acceleration = {
  value: 0.0,
};

function Scene() {
  const three = useThree();
  const light = useRef(/** @type {THREE.PointLight | null} */ (null));
  const moleculeRef = useRef(
    /** @type {THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | null} */ (
      null
    )
  );
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
      if (!moleculeRef.current) {
        return;
      }
      gsap.to(moleculeRef.current.position, {
        duration: 0.75,
        x: 0,
        ease: 'sine.out',
      });
      setExperienceStarted(true);
    });
  }, []);

  React.useEffect(() => {
    emitter.on('transition', (direction = 1) => {
      const tl = gsap.timeline();
      tl.to(acceleration, {
        duration: 0.55,
        value: acceleration.value + 2 * direction,
        ease: 'sine.out',
      });
    });
  }, []);

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();
    const lightX = Math.sin(elapsedTime * 1.1) * 200;
    const lightY = Math.cos(elapsedTime * 1.1) * 200;

    if (light.current) {
      light.current.position.x = lightX;
      light.current.position.y = lightY;
    }

    if (!moleculeRef.current) {
      return;
    }

    if (!experienceStarted) {
      const newScale = Math.sin(elapsedTime * 0.85) * 0.05 + 1.4;
      moleculeRef.current.scale.x = newScale;
      moleculeRef.current.scale.y = newScale;
      moleculeRef.current.scale.z = newScale;
      return;
    }

    if (moleculeRef.current.scale.x > 1) {
      moleculeRef.current.scale.x -= delta * 0.7;
      moleculeRef.current.scale.y -= delta * 0.7;
      moleculeRef.current.scale.z -= delta * 0.7;
    }

    moleculeRef.current.rotation.x -= delta * 0.5;
    moleculeRef.current.rotation.y += delta * 0.5;
    moleculeRef.current.rotation.z = Math.sin(elapsedTime * 0.5) * 0.1;
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
      <BackgroundPlane acceleration={acceleration} />
      <Molecule
        ref={moleculeRef}
        position={[INITIAL_X_POSITION, 0, 0]}
        rotation={[Math.PI / 4, -Math.PI / 3, 0]}
        scale={1.4}
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
