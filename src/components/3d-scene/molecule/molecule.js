import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

import { env } from '../../../js/modules/env';

const gltfLoader = new GLTFLoader();

/**
 * @param {THREE.Object3D | null} object
 * @param object
 */
function isMeshType(object) {
  return object?.type === 'Mesh';
}

function Molecule() {
  const meshRef = useRef(/** @type {THREE.Mesh | null} */ (null));
  const [model, setModel] = React.useState(
    /** @type {THREE.Group<any> | null} */ (null)
  );

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
    });
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.z = Math.sin(meshRef.current.rotation.y);

      meshRef.current.position.x = Math.sin(meshRef.current.rotation.y);
      meshRef.current.position.y = Math.sin(meshRef.current.rotation.y);
      meshRef.current.position.z = Math.sin(meshRef.current.rotation.y);
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
      <mesh ref={meshRef}>
        <primitive object={model} scale={moleculeScale} />
      </mesh>
    )
  );
}

export default Molecule;
