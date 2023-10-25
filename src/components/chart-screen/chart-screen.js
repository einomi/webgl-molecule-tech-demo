import React from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';

import Chart from '../chart/chart';
import { emitter } from '../../js/modules/event-emitter';

class ChartScreen {
  constructor() {
    this.container = /** @type {HTMLElement} */ (
      document.querySelector('[data-chart-screen]')
    );
    this.chartContainer = this.container.querySelector('[data-chart]');
    this.animationElements = this.container.querySelectorAll(
      '[data-animation-element]'
    );
    this.initChart();

    emitter.on('show-chart', () => {
      this.runAnimationIn();
    });
  }

  initChart() {
    if (this.chartContainer) {
      createRoot(this.chartContainer).render(<Chart />);
    }
  }

  runAnimationIn() {
    gsap.set(this.container, { autoAlpha: 1 });
    gsap.fromTo(
      this.animationElements,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.15,
        delay: 0.35,
        ease: 'sine.out',
      }
    );
  }
}

export default new ChartScreen();
