import { Collection, Map, OrderedSet, Seq } from 'immutable';
import { Observable } from 'rxjs';

import { StateObservable } from '../handlers/observables';


// TODO: deprecate alternative keypath types, only accept array

/**
 * Generic `Iterable` with a `reduce` method.
 * @param K - Iterable key type. Defaults to `any`.
 * @param V - Iterable value type. Defaults to `any`.
 */
export interface ReducibleIterable<K = any, V = any> extends Iterable<V> {
  reduce<R = any>(
    reducer: (
      reduction?: R,
      value?: V,
      key?: K,
      iter?: /*this*/ Collection<K, V> | Iterable<V> | V[],
    ) => R,
    initialReduction?: R,
    context?: any,
  ): R;
  /**
   * `IterableKeyPath` may include any additional properties.
   */
  [key: string]: any;
}
export type IterableKeyPath<K = any, V = any> = ReducibleIterable<K, V>;
export type PrimitiveKeyPath = undefined | null | number | string; // TODO: deprecate
export type KeyPath<K = any, V = any> = IterableKeyPath<K, V> | PrimitiveKeyPath;

/** @hidden */
export type ImmitListener = (next?: any, prev?: any, keyPath?: ReadonlyArray<any>) => void;

/** @hidden */
export type RegisTreeNode<T = any> = [ReadonlyArray<any>, OrderedSet<T>];

/** @hidden */
export interface RegisTreeMap<T = any> extends Map<any, any> {
  get(key: any): {} | RegisTreeMap<T> | RegisTreeNode<T>;
  // getIn(keyPath: IterableKeyPath): undefined | RegisTreeMap<T> | OrderedSet<T>;
  set(key: any, value: RegisTreeMap<T> | RegisTreeNode<T>): this;
  // setIn(keyPath: IterableKeyPath, value: RegisTreeMap<T> | OrderedSet<T>): this;
  [key: string]: any;
}

/**
 * Strict action object. If you want more rigid definitions
 * for actions, extend this interface.
 */
export interface Action<T = any> {
  type: T;
}

/**
 * Generic action that allows additional properties.
 * This is useful for situations where metadata may be
 * added to the action by middleware and you don't want
 * to bother with defining those properties.
 */
export interface AnyAction extends Action {
  [key: string]: any;
}

export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T, ...additionalArgs: any[]): T;
}

export interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
  getState(): S;
  dispatch: D;
}

export interface Middleware<DispatchExt = {}, S = any, D extends Dispatch = Dispatch> {
  (api: MiddlewareAPI<D, S>): (next: Dispatch<AnyAction>) => (action: any) => any;
}

export interface Reducer<S = any, A extends Action = AnyAction> {
  (state: S | undefined, action: A): S;
}

export interface Store<S = any, A extends Action = AnyAction> {
  getState(): S;
  dispatch: Dispatch<A>;
  subscribe: typeof Observable.prototype.subscribe;
  observable(): StateObservable<S>;
}
