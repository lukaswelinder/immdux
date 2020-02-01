import { Observer, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Collection, OrderedSet, getIn } from 'immutable';

import { struct } from '../reference/struct';
import { toKeyPathSeq } from '../utils/keypath';

import { isDispatching, ImmduxInternalError } from '../reference/status';

import { IterableKeyPath, AnyAction } from '../types';

// TODO: consider using ES6 set or array instead of imm ordered set

/** @hidden */
const actionObserverSet: OrderedSet<Observer<any>> = OrderedSet().asMutable();
/** @hidden */
let actionObserverArr: Observer<any>[] = [];
/** @hidden */
let queuedStateObservers: (() => void)[] = [];
/** @hidden */
export function flushQueuedObservers(action: AnyAction) {
  for (let i = 0; i < queuedStateObservers.length; i++) {
    const queued = queuedStateObservers[i];
    if (queued) queued();
  }
  for (let i = 0; i < actionObserverArr.length; i++) {
    actionObserverArr[i].next(action);
  }
  queuedStateObservers = [];
}

/** @hidden */
const COMMON_NULL: null = null; // Reduces memory usage when creating type maps.
/**
 * Observable operator used for filtering action observable by `action.type`.
 *
 * @param types
 * One or more strings or regex statements used to filter actions by type.
 */
export function ofType<A extends AnyAction = AnyAction>(types: (string | RegExp)[]) {
  const typeMap: { [key: string]: null } = {};
  const regExpArr: RegExp[] = [];
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    if (typeof type === 'string') typeMap[type] = COMMON_NULL;
    else regExpArr.push(type);
  }
  if (!regExpArr.length) {
    return filter<A>((action) => typeMap.hasOwnProperty(action.type));
  }
  if (regExpArr.length === types.length) {
    return filter<A>((action) => {
      for (let i = 0; i < regExpArr.length; i++) {
        if (regExpArr[i].test(action.type)) return true;
      }
      return false;
    });
  }
  return filter<A>((action) => {
    if (typeMap.hasOwnProperty(action.type)) return true;
    for (let i = 0; i < regExpArr.length; i++) {
      if (regExpArr[i].test(action.type)) return true;
    }
    return false;
  });
}

/**
 * The `ActionObservable` is a simple observable that emits actions.
 *
 * Actions are emitted after state observables. This makes the
 * action observable useful for scheduling updates.
 *
 * ```ts
 * import { Observable, combineLatest } from 'rxjs';
 * import { sample } from 'rxjs/operators';
 * import { action$, state$ } from '@immdux/core';
 *
 * interface ChatError {}
 * interface ChatMessage {}
 * interface User {}
 * type ChatObservable = Observable<[ChatError, ChatMessage[], User]>;
 *
 * const chatError$ = state$.in(['chat', 'error']);
 * const chatMessages$ = state$.in(['chat', 'messages']);
 * const usersOnline$ = state$.in(['session', 'users', 'onlineList']);
 *
 * const chat$: ChatObservable = combineLatest(
 *   chatError$,
 *   chatMessages,
 *   usersOnline$,
 * ).pipe(sample(action$));
 * ```
 *
 * @param types
 * One or more strings or regex statements used to filter actions by type.
 *
 * @noInheritDoc
 */
export class ActionObservable<A extends AnyAction = AnyAction> extends Observable<A> {
  constructor(...types: (string | RegExp)[]) {
    const observe = (observer: Observer<A>) => {
      if (isDispatching) {
        throw new ImmduxInternalError('Subscribing while reducers are executing is forbidden.');
      }
      actionObserverSet.add(observer);
      actionObserverArr = actionObserverSet.toArray();
      return () => {
        actionObserverSet.remove(observer);
        actionObserverArr = actionObserverSet.toArray();
      };
    };
    super(observe);
    if (types.length) return this.pipe(ofType<A>(types));
  }
}

/**
 * The `StateObservable` streams values from a given `KeyPath` in state.
 * Subscribing immediately sets `value` and emits the current state.
 *
 * The state observable will emit values depth first in the order they
 * subscribed. See the [[ActionObservable|ActionObservable docs]] for an
 * example of how to combine state observables into a single update.
 *
 * @param S
 * Type for state being observed, defaults to `any`.
 *
 * @noInheritDoc
 */
export class StateObservable<S = any> extends Observable<S> {
  constructor(targetKeyPath: IterableKeyPath = []) {
    // TODO: reevaluate approach to keypath types
    const keyPathSeq = toKeyPathSeq(targetKeyPath);
    const observe = (observer: Observer<any>) => {
      if (isDispatching) {
        throw new ImmduxInternalError('Subscribing while reducers are executing is forbidden.');
      }
      (this as any).value = getIn(struct.current, this.path, undefined);
      // Value reference for closure.
      let value: S = this.value;
      let isQueued: boolean = false;
      let queueIndex: number | null = null;
      const handleNext = () => {
        (this as any).value = value;
        isQueued = false;
        queueIndex = null;
        observer.next(value);
      };
      const unsubscribe = struct.subscribe(keyPathSeq, (state: any) => {
        // Remove from queue, should only emit last from reducer execution.
        if (isQueued) queuedStateObservers[queueIndex] = null;
        else isQueued = true;
        value = state;
        // Set ref queue index and add to queue.
        queueIndex = queuedStateObservers.length;
        queuedStateObservers.push(handleNext);
      });
      observer.next(this.value);
      // Return cleanup fn.
      return () => {
        // Remove from current place in queue.
        if (isQueued) queuedStateObservers[queueIndex] = null;
        // Unsubscribe from struct.
        unsubscribe();
      };
    };
    super(observe);
    (this as any).path = keyPathSeq.toArray();
    // TODO: throw error if value is accessed before subscribe
  }

  /**
   * Latest value, set immediately before value is emitted.
   */
  readonly value: S;

  /**
   * Path in state that is being observed.
   */
  readonly path: ReadonlyArray<any>;

  /**
   * Creates a nested `StateObservable` using this state observable's
   * path as the base.
   *
   * @param targetKeyPath
   * Concatenated onto existing path.
   */
  public in(targetKeyPath: IterableKeyPath = []) {
    return new StateObservable(this.path.concat(toKeyPathSeq(targetKeyPath).toArray()));
  }
}

/**
 * Root action observable. See [[ActionObservable|ActionObservable docs]]
 * for more information.
 */
export const action$: ActionObservable<AnyAction> = new ActionObservable();

/**
 * Root state observable. See [[StateObservable|StateObservable docs]]
 * for more information.
 */
export const state$: StateObservable<Collection<any, any>> = new StateObservable([]);
state$.subscribe(); // Empty subscribe to keep `value` updated.
