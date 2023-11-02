// @ts-ignore
export function throttle(cb, delay, last = false) {
  let wait = false;

  // @ts-ignore
  return (...args) => {
    if (wait) {
      return;
    }

    cb(...args);
    wait = true;
    setTimeout(() => {
      wait = false;
      if (last) {
        cb(...args);
      }
    }, delay);
  };
}
