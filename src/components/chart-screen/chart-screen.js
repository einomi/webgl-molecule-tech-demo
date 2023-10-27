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
      this.show();
    });

    this.visible = false;

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hide();
      }
    });

    this.closeButton?.addEventListener('click', () => {
      this.hide();
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
        overwrite: true,
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
      overwrite: true,
      onComplete: () => {
        gsap.set(this.container, { autoAlpha: 0 });
      },
    });
  }

  show() {
    if (this.visible) {
      return;
    }
    this.visible = true;
    this.runAnimationIn();
  }

  hide() {
    if (!this.visible) {
      return;
    }
    this.visible = false;
    this.runAnimationOut();
    emitter.emit('hide-chart');
    emitter.emit('transition', -1);
  }
}

export default new ChartScreen();
