import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

import { env } from '../../js/modules/env';
import { emitter } from '../../js/modules/event-emitter';
import { throttle } from '../../js/utils/throttle';

import BackgroundPlane from './background-plane/background-plane';
import Molecule from './molecule/molecule';

const CAMERA_DISTANCE = 1100;
const INITIAL_X_POSITION = env.isTablet ? -250 : -850;
const INITIAL_X_TO_POSITION = env.isTablet ? -200 : -450;

const acceleration = {
  value: 0.0,
};

function Scene() {
  const three = useThree();
  const light = useRef(/** @type {THREE.PointLight | null} */ (null));
  const moleculeRef = useRef(
    /** @type {THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial> | null} */ (
      null
    )
  );
  const moleculeContainerRef = useRef(/** @type {THREE.Group | null} */ (null));
  const [experienceStarted, setExperienceStarted] = React.useState(false);
  const mousePositionRef = useRef(new THREE.Vector2());

  React.useEffect(() => {
    const handleMouseMove = throttle(
      /** @param {MouseEvent} event */ (event) => {
        const x =
          (event.clientX - env.viewportResolution.value.width / 2) /
          env.viewportResolution.value.width;
        const y =
          (event.clientY - env.viewportResolution.value.height / 2) /
          env.viewportResolution.value.height;

        // kill tween if exists
        gsap.killTweensOf(mousePositionRef.current);

        gsap.to(mousePositionRef.current, {
          duration: 0.25,
          x,
          y,
          ease: 'sine.out',
        });
      },
      50
    );
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    emitter.on('transition', (direction = 1) => {
      const tl = gsap.timeline();
      tl.to(acceleration, {
        duration: 0.55,
        value: acceleration.value + 2 * direction,
        ease: 'sine.out',
      });
    });
  }, []);

  React.useEffect(() => {
    emitter.on('experience-started', () => {
      if (!moleculeRef.current) {
        return;
      }
      gsap.to(moleculeRef.current.position, {
        duration: 0.55,
        x: 0,
        ease: 'sine.out',
      });
      gsap.to(moleculeRef.current.scale, {
        duration: 0.55,
        x: 1,
        y: 1,
        z: 1,
        ease: 'sine.out',
      });
      setExperienceStarted(true);
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

    if (moleculeContainerRef.current) {
      const lerpValue = 0.05;
      moleculeContainerRef.current.rotation.x +=
        (mousePositionRef.current.y * 0.05 -
          moleculeContainerRef.current.rotation.x) *
        lerpValue;
      moleculeContainerRef.current.rotation.y +=
        (mousePositionRef.current.x * 0.05 -
          moleculeContainerRef.current.rotation.y) *
        lerpValue;
      moleculeContainerRef.current.position.x +=
        (mousePositionRef.current.x * 30 -
          moleculeContainerRef.current.position.x) *
        lerpValue;
      moleculeContainerRef.current.position.y +=
        (mousePositionRef.current.y * 30 -
          moleculeContainerRef.current.position.y) *
        lerpValue;
    }

    if (!experienceStarted) {
      const newScale = Math.sin(elapsedTime * 0.85) * 0.05 + 1.4;
      moleculeRef.current.scale.x = newScale;
      moleculeRef.current.scale.y = newScale;
      moleculeRef.current.scale.z = newScale;
      return;
    }

    moleculeRef.current.rotation.x -= delta * 0.5;
    moleculeRef.current.rotation.y += delta * 0.5;
    moleculeRef.current.rotation.z = Math.sin(elapsedTime * 0.5) * 0.1;
  });

  function handleWindowLoad() {
    if (!moleculeRef.current) {
      return;
    }
    gsap.to(moleculeRef.current.position, {
      duration: 0.75,
      x: INITIAL_X_TO_POSITION,
      delay: 0.05,
      ease: 'power3.out',
    });
  }

  function handleModelLoaded() {
    if (document.readyState === 'complete') {
      handleWindowLoad();
    } else {
      emitter.on('show-welcome', handleWindowLoad);
    }
  }

  return (
    <>
      <ambientLight intensity={0.05} color="white" />
      <pointLight
        ref={light}
        position={[30, 20, 10]}
        intensity={5000}
        color="#85a2ee"
      />

      <BackgroundPlane
        acceleration={acceleration}
        mousePosition={mousePositionRef.current}
      />
      <group ref={moleculeContainerRef}>
        <Molecule
          ref={moleculeRef}
          position={[INITIAL_X_POSITION, 0, 0]}
          rotation={[Math.PI / 4, -Math.PI / 3, 0]}
          scale={1.4}
          onModelLoaded={handleModelLoaded}
        />
      </group>
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
