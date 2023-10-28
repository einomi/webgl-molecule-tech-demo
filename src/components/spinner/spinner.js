import gsap from 'gsap';

import { emitter } from '../../js/modules/event-emitter';

class Spinner {
  constructor() {
    this.spinnerElement = document.querySelector('[data-spinner]');
    window.addEventListener('load', () => {
      gsap.to(this.spinnerElement, {
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          this.spinnerElement?.remove();
        },
      });
      emitter.emit('show-welcome');
    });
  }
}

export default new Spinner();
