import gsap from 'gsap';

import { emitter } from '../../js/modules/event-emitter';

class Welcome {
  constructor() {
    this.container = /** @type {HTMLElement} */ (
      document.querySelector('[data-welcome]')
    );
    this.animationElements = this.container.querySelectorAll(
      '[data-animation-element]'
    );
    this.button = this.container.querySelector('[data-welcome-button]');
    this.button?.addEventListener('click', () => {
      this.startExperience();
    });
  }

  startExperience() {
    gsap.to(this.animationElements, {
      autoAlpha: 0,
      duration: 0.5,
      y: -20,
      stagger: 0.05,
      ease: 'sine.out',
      onComplete: () => {
        gsap.set(this.container, { autoAlpha: 0 });
      },
    });
    emitter.emit('experience-started');
    emitter.emit('transition');
  }
}

export default new Welcome();
