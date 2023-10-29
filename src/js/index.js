import React from 'react';
import { createRoot } from 'react-dom/client';

import Scene from '../components/3d-scene/3d-scene';
const sceneElement = document.querySelector('[data-3d-scene]');
if (sceneElement) {
  createRoot(sceneElement).render(<Scene />);
}

import './modules/env';
import '../components/spinner/spinner';
import '../components/welcome/welcome';
import '../components/intro/intro';
import '../components/chart-screen/chart-screen';
