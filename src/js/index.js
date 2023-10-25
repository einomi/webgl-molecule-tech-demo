import React from 'react';
import { createRoot } from 'react-dom/client';

import './modules/env';
import '../components/welcome/welcome';
import '../components/intro/intro';
import Scene from '../components/3d-scene/3d-scene';
import '../components/chart-screen/chart-screen';

const sceneElement = document.querySelector('[data-3d-scene]');
if (sceneElement) {
  createRoot(sceneElement).render(<Scene />);
}
