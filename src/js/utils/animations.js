import gsap from 'gsap';

/**
 * @param {NodeListOf<Element>} elements
 * @param {HTMLElement} containerElement
 */
export function runAnimationIn(elements, containerElement) {
  gsap.set(containerElement, { autoAlpha: 1 });
  gsap.fromTo(
    elements,
    { autoAlpha: 0, y: 20 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.05,
      delay: 0.3,
      ease: 'sine.out',
      force3D: true,
      overwrite: true,
    }
  );
}

/**
 * @param {NodeListOf<Element>} elements
 * @param {HTMLElement} containerElement
 *  */
export function runAnimationOut(elements, containerElement) {
  gsap.to(elements, {
    autoAlpha: 0,
    duration: 0.15,
    y: -20,
    stagger: 0.025,
    force3D: true,
    ease: 'sine.out',
    onComplete: () => {
      gsap.set(containerElement, { autoAlpha: 0 });
    },
  });
}
