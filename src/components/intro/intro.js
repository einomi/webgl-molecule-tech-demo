import gsap from 'gsap';

import { emitter } from '../../js/modules/event-emitter';

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
    });
    emitter.on('experience-started', () => {
      this.runAnimationIn();
    });
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

  runAnimationOut() {
    gsap.to(this.animationElements, {
      autoAlpha: 0,
      y: -20,
      stagger: 0.05,
      duration: 0.65,
      ease: 'sine.out',
      onComplete: () => {
        gsap.set(this.container, { autoAlpha: 0 });
      },
    });
  }
}

export default new Intro();
