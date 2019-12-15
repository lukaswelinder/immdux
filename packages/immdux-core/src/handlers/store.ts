import { fromJS } from 'immutable';
import { toKeyPathSeq } from '../utils/keypath';
import { isDispatching, isRegisteringMiddleware, setIsDispatching } from '../reference/status';
import { flushQueuedObservers } from '../reference/observables';
import { reducers } from '../reference/reducers';
import { struct } from '../reference/struct';
import { SET_STATE } from '../actions/actionTypes';

import { AnyAction, Dispatch } from '../types';

// TODO: improve typing approach for action/dispatch/middleware

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
  const prev = struct.current;
  const next = fromJS(state);
  struct.current = next;
  return dispatch({ type: SET_STATE, payload: { prev, next } });
}

/** @hidden */
export function dispatchInternal<A extends AnyAction = AnyAction>(action: A): A {
  setIsDispatching(true);
  const inputState = struct.current;
  // Will not trigger observers if inputState is unchanged.
  struct.update(() => inputState);
  // Iterate over branch reducers (depth first in order registered).
  for (const [path, reducer] of reducers._cachedIterable)
    struct.updateIn(path, (branchState: any) => {
      return reducer(branchState, action);
    });
  setIsDispatching(false);
  flushQueuedObservers(action);
  return action;
}

/** @hidden */
export let dispatchThroughMiddleware: any = dispatchInternal;

/** @hidden */
export function setDispatchThroughMiddleware<D = Dispatch<any>>(d: D) {
  dispatchThroughMiddleware = d;
}
