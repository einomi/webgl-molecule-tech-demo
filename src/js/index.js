import React from 'react';
import { createRoot } from 'react-dom/client';

import './modules/env';
import Scene from '../components/3d-scene/3d-scene';

const sceneElement = document.querySelector('[data-3d-scene]');
if (sceneElement) {
  createRoot(sceneElement).render(
    // @ts-ignore
    <Scene />
  );
}

new (function () {
  this.modules = {
    Intro: require('../components/intro/intro'),
  };
})();
