import gsap from 'gsap';

/**
 * @typedef IntroType
 * @property {HTMLElement} container
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
    this.runAnimation();
  }

  runAnimation() {
    gsap.fromTo(
      this.container.children,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.15,
        delay: 0.1,
        ease: 'sine.out',
      }
    );
  }
}

export default new Intro();
