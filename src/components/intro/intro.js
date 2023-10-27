import { emitter } from '../../js/modules/event-emitter';
import { runAnimationIn, runAnimationOut } from '../../js/utils/animations';

/**
 * @typedef IntroType
 * @property {HTMLElement} container
 * @property {NodeListOf<HTMLElement>} animationElements
 *  */

/** @type {IntroType} */
class Intro {
  constructor() {
    this.container = /** @type {HTMLElement} */ (
      document.querySelector('[data-intro]')
    );
    if (!this.container) {
      return;
    }
    this.animationElements = /** @type {NodeListOf<HTMLElement>} */ (
      this.container.querySelectorAll('[data-animation-element]')
    );
    this.button = /** @type {HTMLElement} */ (
      this.container.querySelector('[data-button]')
    );
    this.button.addEventListener('click', () => {
      this.runAnimationOut();
      emitter.emit('show-chart');
      emitter.emit('transition');
    });
    emitter.on('experience-started', () => {
      this.runAnimationIn();
    });

    emitter.on('hide-chart', () => {
      this.runAnimationIn();
    });
  }

  runAnimationIn() {
    runAnimationIn(this.animationElements, this.container);
  }

  runAnimationOut() {
    runAnimationOut(this.animationElements, this.container);
  }
}

export default new Intro();
