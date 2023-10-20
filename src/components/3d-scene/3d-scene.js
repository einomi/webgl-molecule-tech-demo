import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

import { env } from '../../js/modules/env';

import BackgroundPlane from './background-plane/background-plane';

const gltfLoader = new GLTFLoader();
const CAMERA_DISTANCE = 1000;

/**
 * @param {THREE.Object3D | null} object
 * @param object
 */
function isMeshType(object) {
  return object?.type === 'Mesh';
}

function Mesh() {
  const meshRef = useRef(/** @type {THREE.Mesh | null} */ (null));
  const [model, setModel] = React.useState(
    /** @type {THREE.Group<any> | null} */ (null)
  );
  const three = useThree();
  const light = useRef(/** @type {THREE.PointLight | null} */ (null));
  const light2 = useRef(/** @type {THREE.PointLight | null} */ (null));

  React.useEffect(() => {
    gltfLoader.load('/molecule.gltf', (gltf) => {
      setModel(gltf.scene);
      // set materials for children
      gltf.scene.traverse((child) => {
        if (isMeshType(child)) {
          child.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.5,
            metalness: 0.5,
          });
        }
      });

      // change opacity
      gltf.scene.children[0].material.opacity = 0.5;
    });
  }, []);

  React.useEffect(() => {
    // near and far plane
    three.camera.near = 0.1;
    three.camera.far = 10000;
    // anti aliasing
    // @ts-ignore
    three.gl.useSRGBEncoding = true;
    three.camera.position.z = CAMERA_DISTANCE;
    three.camera.fov =
      2 *
      Math.atan(env.viewportResolution.value.height / 2 / CAMERA_DISTANCE) *
      (180 / Math.PI);
    three.camera.updateProjectionMatrix();
  }, []);

  // use frame, rotate mesh
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.z = Math.sin(meshRef.current.rotation.y);

      meshRef.current.position.x = Math.sin(meshRef.current.rotation.y);
      meshRef.current.position.y = Math.sin(meshRef.current.rotation.y);
      meshRef.current.position.z = Math.sin(meshRef.current.rotation.y);
    }

    if (light.current) {
      const elapsedTime = _state.clock.getElapsedTime();
      // move light in circle
      light.current.position.x = Math.sin(elapsedTime * 1.1) * 200;
      light.current.position.y = Math.cos(elapsedTime * 1.1) * 200;
    }

    if (light2.current) {
      const elapsedTime = _state.clock.getElapsedTime();
      // move light in circle
      light2.current.position.x = -Math.sin(elapsedTime * 1.1) * 200;
      light2.current.position.y = -Math.cos(elapsedTime * 1.1) * 200;
    }
  });

  const moleculeScale = React.useMemo(() => {
    if (env.viewportResolution.value.width <= 768) {
      return 0.4 * env.viewportResolution.value.width;
    }
    return 0.2 * env.viewportResolution.value.width;
  }, []);

  return (
    model && (
      <>
        <pointLight
          ref={light}
          position={[30, 20, 10]}
          intensity={5000}
          color="#85a2ee"
        />
        <mesh ref={meshRef}>
          <primitive object={model} scale={moleculeScale} />
        </mesh>
        <BackgroundPlane />
      </>
    )
  );
}

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.05} color="white" />
      <Mesh />
    </Canvas>
  );
}

export default Scene;
