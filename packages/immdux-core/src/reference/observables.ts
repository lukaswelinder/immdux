import { Observer, Observable, ConnectableObservable, Subject, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Collection, OrderedSet, getIn } from 'immutable';

import { struct } from './struct';
import { toKeyPathSeq } from '../utils/keypath';

import { IterableKeyPath, AnyAction } from '../types';

// TODO: move helper fns to `handlers/observables`
// TODO: consider using ES6 set or array instead of imm ordered set

/** @hidden */
const actionObserverSet: OrderedSet<Observer<any>> = OrderedSet().asMutable();
/** @hidden */
let actionObserverArr: Observer<any>[] = [];
/** @hidden */
let queuedStateObservers: [(state: any) => void, any][] = [];
/** @hidden */
export function flushQueuedObservers(action: AnyAction) {
  for (let i = 0; i < queuedStateObservers.length; i++) {
    const queued = queuedStateObservers[i];
    if (queued) {
      const [handleNext, state] = queued;
      handleNext(state);
    }
  }
  // TODO: consider action emission before state emission
  for (let i = 0; i < actionObserverArr.length; i++) {
    actionObserverArr[i].next(action);
  }
  queuedStateObservers = [];
}

/** @hidden */
const COMMON_NULL: null = null; // Reduces memory usage when creating type maps.
/** @hidden */
function ofType<A extends AnyAction = AnyAction>(types: (string | RegExp)[]) {
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
 * The `ActionObservable` is a connectable (multicast) observable that streams
 * dispatched actions once reducers have completed executing and the
 * latest state has been emitted.
 *
 * An advantage to creating your own action observable instead of using
 * the exported `action$` is having the ability to "initialize" your
 * subscriptions after they have been created.
 *
 * ```ts
 * import { Subscription } from 'rxjs';
 * import { ActionObservable, AnyAction } from 'immdux';
 *
 * const myAction$: ActionObservable<AnyAction> = new ActionObservable();
 * const mySubscription: Subscription = myAction$.subscribe((action) => {
 *   console.log(action.type);
 * });
 * // ... add more subscribers
 * ```
 *
 * Nothing will be emitted to subscribers until `connect` is called.
 *
 * ```ts
 * const rootSubscription: Subscription = myAction$.connect();
 * ```
 *
 * If we want to stop the stream of actions to subscribers, we simply
 * unsubscribe from `rootSubscription`.
 *
 * ```ts
 * rootSubscription.unsubscribe();
 * ```
 *
 * We can easily resume the stream by calling `connect` again.
 *
 * ```ts
 * const newRootSubscription: Subscription = myAction$.connect();
 * ```
 *
 * This behavior makes it easy to improve performance by providing
 * a single place to toggle multiple observables.
 *
 * @noInheritDoc
 */
export class ActionObservable<A extends AnyAction = AnyAction> extends ConnectableObservable<A> {
  constructor(...types: (string | RegExp)[]) {
    const observable = new Observable((observer: Observer<A>) => {
      actionObserverSet.add(observer);
      actionObserverArr = actionObserverSet.toArray();
      return () => {
        actionObserverSet.remove(observer);
        actionObserverArr = actionObserverSet.toArray();
      };
    });
    super(types.length ? observable.pipe(ofType<A>(types)) : observable, () => new Subject());
  }
  /** @hidden */
  public lift(operator: any) {
    const observable = new ActionObservable<any>();
    observable.source = this;
    observable.operator = operator;
    return observable;
  }
}

/**
 * The `StateObservable` streams values from a given `KeyPath` in state.
 *
 * Similar to `ActionObservable`, the state observable is a connectable
 * (multicast) observable, meaning that subscribers will not be called
 * until `connect` is called.
 *
 * However, the state observable is a little different in the way it emits
 * because its subject is an `RxJS.BehaviorSubject`, meaning that once
 * connected, subscribers immediately (synchronously) are called with
 * the latest state.
 *
 * @param S
 * Type for state being observed, defaults to `any`.
 *
 * @noInheritDoc
 */
export class StateObservable<S = any> extends ConnectableObservable<S> {
  constructor(targetKeyPath: IterableKeyPath = []) {
    // TODO: reevaluate approach to keypath types
    const keyPathSeq = toKeyPathSeq(targetKeyPath);
    super(
      // Observable that leverages `Immit` to capture state changes at depth.
      new Observable((observer: Observer<any>) => {
        let isQueued: boolean = false;
        let queueIndex: number | null = null;
        const handleNext = (state: S) => {
          isQueued = false;
          queueIndex = null;
          observer.next(state);
        };
        const observerRef: [(state: S) => void, any] = [handleNext, undefined];
        const unsubscribe = struct.subscribe(keyPathSeq, (state: any) => {
          (this as any).value = state;
          if (isQueued) {
            queuedStateObservers[queueIndex] = null;
          }
          isQueued = true;
          // Set ref state.
          observerRef[1] = state;
          // Set ref to queue index.
          queueIndex = queuedStateObservers.length;
          queuedStateObservers.push(observerRef);
        });
        // Return cleanup fn.
        return () => {
          // Remove from current place in queue.
          queuedStateObservers[queueIndex] = null;
          // Unsubscribe from struct.
          unsubscribe();
        };
      }),
      // Subject factory, called first upon `.connect()` invocation.
      () => {
        // Set value on state observable.
        (this as any).value = getIn(struct.current, keyPathSeq, undefined);
        // Returns a behavior subject (ensures that subscribers immediately get most recent value).
        return new BehaviorSubject<S>(this.value);
      },
    );
    this.path = keyPathSeq.toArray();
  }
  /** @hidden */
  public lift(operator: any) {
    const observable = new StateObservable<any>();
    observable.source = this;
    observable.operator = operator; // TODO: investigate deprecation and its impact
    return observable;
  }
  /**
   * Observed path in state.
   */
  public readonly path: ReadonlyArray<any>;
  /**
   * Current state at [`path`](#path). This value is set synchronously after reducers
   * have executed, before the next value is emitted.
   *
   * This property is only defined/updated if the state observable is connected.
   */
  public readonly value: S;
}

/**
 * Root action observable, always connected.
 */
export const action$: ActionObservable = new ActionObservable();
action$.connect();

/**
 * Root state observable, always connected.
 */
export const state$: StateObservable<Collection<any, any>> = new StateObservable();
state$.connect();
