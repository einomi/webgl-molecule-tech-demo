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
    this.closeButton = this.container.querySelector(
      '[data-chart-screen-close]'
    );
    this.initChart();

    emitter.on('show-chart', () => {
      this.runAnimationIn();
    });

    emitter.on('hide-chart', () => {
      this.runAnimationOut();
    });

    this.closeButton?.addEventListener('click', () => {
      emitter.emit('hide-chart');
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
        stagger: 0.05,
        delay: 0.35,
        ease: 'sine.out',
      }
    );
  }

  runAnimationOut() {
    gsap.to(this.animationElements, {
      autoAlpha: 0,
      y: -20,
      duration: 0.25,
      stagger: 0.05,
      ease: 'sine.out',
      onComplete: () => {
        gsap.set(this.container, { autoAlpha: 0 });
      },
    });
  }
}

export default new ChartScreen();
