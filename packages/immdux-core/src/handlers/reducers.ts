import { reducers } from '../reference/reducers';
import { isDispatching } from '../reference/status';
import { dispatch } from './store';
import { REGISTER_REDUCER, REMOVE_REDUCER } from '../actions/actionTypes';

import { IterableKeyPath, Action, AnyAction, Reducer } from '../types';

// TODO: re-implement bulk register method
// TODO: improve docs

/**
 * Registers one or more reducers at the given path.
 */
export function registerReducer<S = any, A extends Action = AnyAction>(
  targetKeyPath: IterableKeyPath,
  ...entries: Reducer<S, A>[]
): Action<typeof REGISTER_REDUCER> & { payload: { keyPath: any[]; entries: Reducer<S, A>[] } } {
  if (isDispatching)
    throw new Error('Registering/removing reducers while reducers are executing is forbidden.');
  const { keyPath } = reducers.register(targetKeyPath, ...entries);
  reducers.cache();
  return dispatch({ type: REGISTER_REDUCER, payload: { keyPath, entries } });
}

/**
 * Removes an existing reducer by its resolved `KeyPath`.
 */
export function removeReducer<S = any, A extends Action = AnyAction>(
  targetKeyPath: IterableKeyPath,
  ...removals: Reducer<S, A>[]
): Action<typeof REMOVE_REDUCER> & { payload: { keyPath: any[]; entries: Reducer<S, A>[] } } {
  if (isDispatching)
    throw new Error('Registering/removing reducers while reducers are executing is forbidden.');
  const { keyPath, entries } = reducers.remove(targetKeyPath, ...removals);
  const action = dispatch({ type: REMOVE_REDUCER, payload: { keyPath, entries } });
  reducers.cache();
  return action;
}
