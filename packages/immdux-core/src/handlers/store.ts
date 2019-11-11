import { fromJS } from 'immutable';
import { toKeyPathSeq } from '../utils/keypath';
import { isDispatching, isRegisteringMiddleware, setIsDispatching } from '../reference/status';
import { flushQueuedObservers } from '../reference/observables';
import { reducers } from '../reference/reducers';
import { struct } from '../reference/struct';
import { SET_STATE } from '../actions/actionTypes';

import { AnyAction, Dispatch } from '../types';

// TODO: support scoped dispatch
// TODO: support dispatching multiple actions
/**
 * Dispatches action to reducers.
 */
export function dispatch<A = any>(action: A): A {
  if (isRegisteringMiddleware)
    throw new Error('Dispatching while registering middleware is forbidden.');
  if (isDispatching) throw new Error('Dispatching while reducer is executing is forbidden.');
  return dispatchThroughMiddleware(<any>action);
}

/**
 * Set the state manually, helpful for providing an initial state.
 * This should ideally be done before reducers are registered, but is not required.
 */
export function setState(state: any) {
  if (isDispatching) throw new Error('Setting state while reducer is executing is forbidden.');
  const prev = struct.current;
  const next = fromJS(state);
  setIsDispatching(true);
  const action = { type: SET_STATE, payload: { prev, next } };
  executeReducers(next, action);
  setIsDispatching(false);
  flushQueuedObservers(action);
  return next;
}

/** @hidden */
export function dispatchInternal<A extends AnyAction = AnyAction>(action: A): A {
  setIsDispatching(true);
  executeReducers(struct.current, action);
  setIsDispatching(false);
  flushQueuedObservers(action);
  return action;
}

// TODO: improve typing approach
/** @hidden */
export let dispatchThroughMiddleware: any = dispatchInternal;
/** @hidden */
export function setDispatchThroughMiddleware<D = Dispatch<any>>(d: D) {
  dispatchThroughMiddleware = d;
}

/**
 * Calls registered reducers to update state.
 * @hidden
 */
function executeReducers(inputState: any, action: AnyAction) {
  // Will not trigger observers if inputState is unchanged.
  struct.update(() => inputState);
  // Iterate over branch reducers (depth first is only order guarantee).
  for (const [path, reducer] of reducers._cachedIterable)
    struct.updateIn(path, (branchState: any) => {
      return reducer(branchState, action);
    });
  // Returns current immutable state.
  return struct.current;
}
