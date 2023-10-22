import React from 'react';
import { createRoot } from 'react-dom/client';

import Chart from '../chart/chart';

const containerElement = document.querySelector('[data-chart]');
if (containerElement) {
  createRoot(containerElement).render(<Chart />);
}
