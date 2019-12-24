[@immdux/core](../README.md) › [StateObservable](stateobservable.md)

# Class: StateObservable <**S**>

The `StateObservable` streams values from a given `KeyPath` in state.
Subscribing immediately sets `value` and emits the current state.

The state observable will emit values depth first in the order they
subscribed. See the [ActionObservable docs](actionobservable.md) for an
example of how to combine state observables into a single update.

## Type parameters

▪ **S**

Type for state being observed, defaults to `any`.

## Hierarchy

* Observable‹S›

  ↳ **StateObservable**

## Implements

* Subscribable‹S›

## Index

### Constructors

* [constructor](stateobservable.md#constructor)

### Properties

* [path](stateobservable.md#path)
* [value](stateobservable.md#value)

### Methods

* [in](stateobservable.md#in)

## Constructors

### <a id="constructor" name="constructor"></a>  constructor

\+ **new StateObservable**(`targetKeyPath`: [IterableKeyPath](../README.md#iterablekeypath)): *[StateObservable](stateobservable.md)*

*Overrides void*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`targetKeyPath` | [IterableKeyPath](../README.md#iterablekeypath) |  [] |

**Returns:** *[StateObservable](stateobservable.md)*

## Properties

### <a id="path" name="path"></a>  path

• **path**: *ReadonlyArray‹any›*

Path in state that is being observed.

___

### <a id="value" name="value"></a>  value

• **value**: *S*

Latest value, set immediately before value is emitted.

## Methods

### <a id="in" name="in"></a>  in

▸ **in**(`targetKeyPath`: [IterableKeyPath](../README.md#iterablekeypath)): *[StateObservable](stateobservable.md)‹any›*

Creates a nested `StateObservable` using this state observable's
path as the base.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`targetKeyPath` | [IterableKeyPath](../README.md#iterablekeypath) |  [] |  Concatenated onto existing path.  |

**Returns:** *[StateObservable](stateobservable.md)‹any›*
