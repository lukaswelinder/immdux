export { store } from './reference/store';
export { ActionObservable, StateObservable, action$, state$ } from './reference/observables';

export { registerReducer, removeReducer } from './handlers/reducers';

export { registerMiddleware, removeMiddleware } from './handlers/middleware';

export { dispatch, setState } from './handlers/store';

export { REGISTER_REDUCER, REMOVE_REDUCER, SET_STATE } from './actions/actionTypes';

export { IterableKeyPath, PrimitiveKeyPath, KeyPath } from './types';

// TODO: register global to track multiple instances
// TODO: centralize error messaging by error code to cut payload size
