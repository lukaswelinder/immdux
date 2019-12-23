[@immdux/core](../README.md) › [Store](store.md)

# Interface: Store <**S, A**>

## Type parameters

▪ **S**

▪ **A**: *[Action](action.md)*

## Hierarchy

* **Store**

## Index

### Properties

* [dispatch](store.md#dispatch)
* [subscribe](store.md#subscribe)

### Methods

* [getState](store.md#getstate)
* [observable](store.md#observable)

## Properties

###  dispatch

• **dispatch**: *[Dispatch](dispatch.md)‹A›*

___

###  subscribe

• **subscribe**: *subscribe*

## Methods

###  getState

▸ **getState**(): *S*

**Returns:** *S*

___

###  observable

▸ **observable**(): *[StateObservable](../classes/stateobservable.md)‹S›*

**Returns:** *[StateObservable](../classes/stateobservable.md)‹S›*
