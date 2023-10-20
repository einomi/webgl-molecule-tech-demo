import React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { env } from '../../../js/modules/env';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

function BackgroundPlane() {
  const planeRef = React.useRef();

  // Create custom shader material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() },
      u_texture: { value: null },
      u_aspectRatio: { value: 1 },
      u_texture_width: { value: 1.0 },
      u_texture_height: { value: 1.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });

  React.useEffect(() => {
    const texture = new THREE.TextureLoader().load('/background.jpg');
    material.uniforms.u_texture = { value: texture };
    material.uniforms.u_resolution.value = new THREE.Vector2(
      env.viewportResolution.value.width,
      env.viewportResolution.value.height
    );

    texture.onUpdate = () => {
      updateTexture();
    };

    function updateTexture() {
      if (!texture) {
        return;
      }

      material.uniforms.u_texture_width.value = texture.image.width;
      material.uniforms.u_texture_height.value = texture.image.height;
    }
  }, []);

  useFrame(({ clock }) => {
    if (planeRef.current) {
      material.uniforms.u_time.value = clock.elapsedTime;
    }
  });

  return (
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
  );
}

export default BackgroundPlane;
