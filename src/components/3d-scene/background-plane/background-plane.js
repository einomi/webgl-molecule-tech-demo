import React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { env } from '../../../js/modules/env';
import { emitter } from '../../../js/modules/event-emitter';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

/**
 * @typedef Props
 * @property {{value: number}} acceleration
 * @property {THREE.Vector2} mousePosition
 *  */

/**
 * @param {Props} props
 *  */
function BackgroundPlane({ acceleration, mousePosition }) {
  const planeRef = React.useRef(null);
  const [material, setMaterial] = React.useState(
    /** @type {THREE.ShaderMaterial | null} */ (null)
  );

  React.useEffect(() => {
    const texture = new THREE.TextureLoader().load(
      '/background.jpg',
      updateTexture
    );

    setMaterial(
      new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 1.0 },
          u_resolution: {
            value: new THREE.Vector2(
              env.viewportResolution.value.width,
              env.viewportResolution.value.height
            ),
          },
          u_texture: { value: texture },
          u_texture_width: { value: 1.0 },
          u_texture_height: { value: 1.0 },
          u_acceleration: acceleration,
          u_mouse_position: { value: mousePosition },
        },
        vertexShader,
        fragmentShader,
        transparent: false,
      })
    );

    texture.onUpdate = () => {
      updateTexture();
    };

    function updateTexture() {
      if (!texture) {
        return;
      }
    }
  }, []);

  React.useEffect(() => {
    if (!material) {
      return;
    }
    emitter.on('env:windowResized', () => {
      material.uniforms.u_resolution.value = new THREE.Vector2(
        env.viewportResolution.value.width,
        env.viewportResolution.value.height
      );
    });
  }, []);

  useFrame(({ clock }) => {
    if (planeRef.current && material) {
      material.uniforms.u_time.value = clock.elapsedTime;
    }
  });

  return (
    material && (
      <mesh ref={planeRef} position={[0, 0, -300]}>
        <planeGeometry
          attach="geometry"
          args={[
            env.viewportResolution.value.width * 1.5,
            env.viewportResolution.value.height * 1.5,
            10,
          ]}
        />
        <primitive attach="material" object={material} />
      </mesh>
    )
  );
}

export default BackgroundPlane;
