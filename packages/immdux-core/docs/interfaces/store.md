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

### <a id="dispatch" name="dispatch"></a>  dispatch

• **dispatch**: *[Dispatch](dispatch.md)‹A›*

___

### <a id="subscribe" name="subscribe"></a>  subscribe

• **subscribe**: *subscribe*

## Methods

### <a id="getstate" name="getstate"></a>  getState

▸ **getState**(): *S*

**Returns:** *S*

___

### <a id="observable" name="observable"></a>  observable

▸ **observable**(): *[StateObservable](../classes/stateobservable.md)‹S›*

**Returns:** *[StateObservable](../classes/stateobservable.md)‹S›*
