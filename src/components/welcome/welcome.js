import { emitter } from '../../js/modules/event-emitter';

class Welcome {
  constructor() {
    this.button = document.querySelector('[data-welcome-button]');
    this.button?.addEventListener('click', () => {
      this.start();
    });
  }

  start() {
    emitter.emit('experience-started');
  }
}

export default new Welcome();
