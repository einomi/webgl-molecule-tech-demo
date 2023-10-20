import { createNanoEvents } from 'nanoevents';

export const emitter = createNanoEvents();

// eslint-disable-next-line no-underscore-dangle
window.__eventEmitter = emitter;
