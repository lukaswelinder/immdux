[@immdux/core](../README.md) › [StateObservable](stateobservable.md)

# Class: StateObservable <**S**>

The `StateObservable` streams values from a given `KeyPath` in state.

Similar to `ActionObservable`, the state observable is a connectable
(multicast) observable, meaning that subscribers will not be called
until `connect` is called.

However, the state observable is a little different in the way it emits
because its subject is an `RxJS.BehaviorSubject`, meaning that once
connected, subscribers immediately (synchronously) are called with
the latest state.

## Type parameters

▪ **S**

Type for state being observed, defaults to `any`.

## Hierarchy

* ConnectableObservable‹S›

  ↳ **StateObservable**

## Implements

* Subscribable‹S›

## Index

### Constructors

* [constructor](stateobservable.md#constructor)

### Properties

* [path](stateobservable.md#path)
* [value](stateobservable.md#value)

## Constructors

###  constructor

\+ **new StateObservable**(`targetKeyPath`: [IterableKeyPath](../README.md#iterablekeypath)): *[StateObservable](stateobservable.md)*

*Overrides void*

*Defined in [reference/observables.ts:148](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/reference/observables.ts#L148)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`targetKeyPath` | [IterableKeyPath](../README.md#iterablekeypath) |  [] |

**Returns:** *[StateObservable](stateobservable.md)*

## Properties

###  path

• **path**: *ReadonlyArray‹any›*

*Defined in [reference/observables.ts:203](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/reference/observables.ts#L203)*

Observed path in state.

___

###  value

• **value**: *S*

*Defined in [reference/observables.ts:210](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/reference/observables.ts#L210)*

Current state at [`path`](#path). This value is set synchronously after reducers
have executed, before the next value is emitted.

This property is only defined/updated if the state observable is connected.
