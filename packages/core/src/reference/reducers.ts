import { RegisTree } from '../utils/registree';

import { Reducer, Action } from '../types';

/** @hidden */
export const reducers = new RegisTree({
  groupPath(_, reducerSet): Reducer {
    const reducers = reducerSet.toArray();
    const reducerCount = reducers.length;
    return (state: any, action: Action): any => {
      let nextState = state;
      for (let i = 0; i < reducerCount; i++) nextState = reducers[i](nextState, action);
      return nextState;
    };
  },
});

reducers._cachedIterable = [];

// TODO: investigate scoped cache
// TODO: implement cache method on registree util
reducers.cache = (): void => {
  reducers._cachedIterable = [...reducers];
};
