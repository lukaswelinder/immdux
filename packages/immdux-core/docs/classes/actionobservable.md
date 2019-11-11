[@immdux/core](../README.md) › [ActionObservable](actionobservable.md)

# Class: ActionObservable <**A**>

The `ActionObservable` is a connectable (multicast) observable that streams
dispatched actions once reducers have completed executing and the
latest state has been emitted.

An advantage to creating your own action observable instead of using
the exported `action$` is having the ability to "initialize" your
subscriptions after they have been created.

```ts
import { Subscription } from 'rxjs';
import { ActionObservable, AnyAction } from 'immdux';

const myAction$: ActionObservable<AnyAction> = new ActionObservable();
const mySubscription: Subscription = myAction$.subscribe((action) => {
  console.log(action.type);
});
// ... add more subscribers
```

Nothing will be emitted to subscribers until `connect` is called.

```ts
const rootSubscription: Subscription = myAction$.connect();
```

If we want to stop the stream of actions to subscribers, we simply
unsubscribe from `rootSubscription`.

```ts
rootSubscription.unsubscribe();
```

We can easily resume the stream by calling `connect` again.

```ts
const newRootSubscription: Subscription = myAction$.connect();
```

This behavior makes it easy to improve performance by providing
a single place to toggle multiple observables.

## Type parameters

▪ **A**: *[AnyAction](../interfaces/anyaction.md)*

## Hierarchy

* ConnectableObservable‹A›

  ↳ **ActionObservable**

## Implements

* Subscribable‹A›

## Index

### Constructors

* [constructor](actionobservable.md#constructor)

## Constructors

###  constructor

\+ **new ActionObservable**(...`types`: string | RegExp[]): *[ActionObservable](actionobservable.md)*

*Overrides void*

*Defined in [reference/observables.ts:110](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/reference/observables.ts#L110)*

**Parameters:**

Name | Type |
------ | ------ |
`...types` | string &#124; RegExp[] |

**Returns:** *[ActionObservable](actionobservable.md)*
