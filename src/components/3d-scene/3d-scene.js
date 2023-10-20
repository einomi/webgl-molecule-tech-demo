import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const gltfLoader = new GLTFLoader();

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

  React.useEffect(() => {
    gltfLoader.load('/molecule.gltf', (gltf) => {
      setModel(gltf.scene);
      // set materials for children
      gltf.scene.traverse((child) => {
        if (isMeshType(child)) {
          // @ts-ignore
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0x101010,
            roughness: 0.6,
            metalness: 0.5,
          });
        }
      });
    });
  }, []);

  React.useEffect(() => {
    // @ts-ignore
    three.gl.useSRGBEncoding = true;
    three.camera.position.z = 12;
    // change fov
    // @ts-ignore
    three.camera.fov = 40;
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
      light.current.position.x = Math.sin(elapsedTime * 0.5) * 10;
      light.current.position.y = Math.cos(elapsedTime * 0.5) * 10;
    }
  });

  return (
    model && (
      <>
        <pointLight
          ref={light}
          position={[30, -200, -10]}
          intensity={1000}
          color="blue"
        />
        <mesh ref={meshRef}>
          <primitive object={model} scale={5} />
        </mesh>
        {/*<mesh*/}
        {/*    position={[0, 0, -10]}*/}
        {/*>*/}
        {/*  <planeGeometry args={[100, 100, 10]}*/}

        {/*  />*/}
        {/*  <meshStandardMaterial color="black"  />*/}
        {/*</mesh>*/}
      </>
    )
  );
}

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={10.5} color="blue" />
      <Mesh />
    </Canvas>
  );
}

export default Scene;
