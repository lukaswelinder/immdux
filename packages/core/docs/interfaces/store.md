[@immdux/core](../README.md) › [Store](store.md)

# Interface: Store <**S, A**>

## Type parameters

▪ **S**

▪ **A**

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

*Defined in [types/index.ts:83](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/types/index.ts#L83)*

___

###  subscribe

• **subscribe**: *subscribe*

*Defined in [types/index.ts:84](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/types/index.ts#L84)*

## Methods

###  getState

▸ **getState**(): *S*

*Defined in [types/index.ts:82](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/types/index.ts#L82)*

**Returns:** *S*

___

###  observable

▸ **observable**(): *[StateObservable](../classes/stateobservable.md)‹S›*

*Defined in [types/index.ts:85](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/types/index.ts#L85)*

**Returns:** *[StateObservable](../classes/stateobservable.md)‹S›*
