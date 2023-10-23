import React from 'react';
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

function Molecule(props, ref) {
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

  const moleculeScale = React.useMemo(() => {
    if (env.viewportResolution.value.width <= 768) {
      return 0.4 * env.viewportResolution.value.width;
    }
    return 0.2 * env.viewportResolution.value.width;
  }, []);

  return (
    model && (
      <mesh ref={ref} {...props}>
        <primitive object={model} scale={moleculeScale} />
      </mesh>
    )
  );
}

export default React.forwardRef(Molecule);
