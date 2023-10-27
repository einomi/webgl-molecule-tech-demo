import { emitter } from '../../js/modules/event-emitter';
import { runAnimationOut } from '../../js/utils/animations';

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
    runAnimationOut(this.animationElements, this.container);
    emitter.emit('experience-started');
    emitter.emit('transition');
  }
}

export default new Welcome();
