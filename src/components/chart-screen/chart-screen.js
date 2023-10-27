import React from 'react';
import { createRoot } from 'react-dom/client';

import Chart from '../chart/chart';
import { emitter } from '../../js/modules/event-emitter';
import { runAnimationIn, runAnimationOut } from '../../js/utils/animations';

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
    runAnimationIn(this.animationElements, this.container);
  }

  runAnimationOut() {
    runAnimationOut(this.animationElements, this.container);
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
