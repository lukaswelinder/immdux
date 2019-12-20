import { state$ } from './observables';
import { dispatch } from './dispatch';

import { Store } from '../types';

export const store: Store = {
  dispatch,
  getState() {
    return state$.value;
  },
  observable() {
    return state$;
  },
  subscribe(...args: any[]) {
    // TODO: improve typing
    return state$.subscribe(...args);
  },
};
