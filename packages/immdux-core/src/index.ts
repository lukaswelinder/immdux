export { store } from './handlers/store';
export { ActionObservable, StateObservable, action$, state$, ofType } from './handlers/observables';

export { registerReducer, removeReducer } from './handlers/reducers';

export { registerMiddleware, removeMiddleware } from './handlers/middleware';

export { dispatch, setState } from './handlers/dispatch';

export { REGISTER_REDUCER, REMOVE_REDUCER, SET_STATE } from './constants/actionTypes';

export { IterableKeyPath, PrimitiveKeyPath, KeyPath } from './types';

// TODO: register global to track multiple instances
// TODO: centralize error messaging by error code to cut payload size
