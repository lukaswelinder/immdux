[@immdux/core](README.md)

# @immdux/core

## Index

### Classes

* [ActionObservable](classes/actionobservable.md)
* [StateObservable](classes/stateobservable.md)

### Interfaces

* [Action](interfaces/action.md)
* [AnyAction](interfaces/anyaction.md)
* [Dispatch](interfaces/dispatch.md)
* [Middleware](interfaces/middleware.md)
* [MiddlewareAPI](interfaces/middlewareapi.md)
* [Reducer](interfaces/reducer.md)
* [ReducibleIterable](interfaces/reducibleiterable.md)
* [Store](interfaces/store.md)

### Type aliases

* [IterableKeyPath](README.md#iterablekeypath)
* [KeyPath](README.md#keypath)
* [PrimitiveKeyPath](README.md#primitivekeypath)

### Variables

* [REGISTER_REDUCER](README.md#const-register_reducer)
* [REMOVE_REDUCER](README.md#const-remove_reducer)
* [SET_STATE](README.md#const-set_state)
* [action$](README.md#const-action$)
* [state$](README.md#const-state$)

### Functions

* [dispatch](README.md#dispatch)
* [registerMiddleware](README.md#registermiddleware)
* [registerReducer](README.md#registerreducer)
* [removeMiddleware](README.md#removemiddleware)
* [removeReducer](README.md#removereducer)
* [setState](README.md#setstate)

### Object literals

* [store](README.md#const-store)

## Type aliases

###  IterableKeyPath

Ƭ **IterableKeyPath**: *[ReducibleIterable](interfaces/reducibleiterable.md)‹K, V›*

*Defined in [types/index.ts:27](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/types/index.ts#L27)*

___

###  KeyPath

Ƭ **KeyPath**: *[IterableKeyPath](README.md#iterablekeypath)‹K, V› | [PrimitiveKeyPath](README.md#primitivekeypath)*

*Defined in [types/index.ts:29](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/types/index.ts#L29)*

___

###  PrimitiveKeyPath

Ƭ **PrimitiveKeyPath**: *undefined | null | number | string*

*Defined in [types/index.ts:28](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/types/index.ts#L28)*

## Variables

### `Const` REGISTER_REDUCER

• **REGISTER_REDUCER**: *string* = "@@immdux/REGISTER_REDUCER"

*Defined in [actions/actionTypes.ts:1](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/actions/actionTypes.ts#L1)*

___

### `Const` REMOVE_REDUCER

• **REMOVE_REDUCER**: *string* = "@@immdux/REMOVE_REDUCER"

*Defined in [actions/actionTypes.ts:2](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/actions/actionTypes.ts#L2)*

___

### `Const` SET_STATE

• **SET_STATE**: *string* = "@@immdux/SET_STATE"

*Defined in [actions/actionTypes.ts:3](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/actions/actionTypes.ts#L3)*

___

### `Const` action$

• **action$**: *[ActionObservable](classes/actionobservable.md)* =  new ActionObservable()

*Defined in [reference/observables.ts:217](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/reference/observables.ts#L217)*

Root action observable, always connected.

___

### `Const` state$

• **state$**: *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››* =  new StateObservable()

*Defined in [reference/observables.ts:223](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/reference/observables.ts#L223)*

Root state observable, always connected.

## Functions

###  dispatch

▸ **dispatch**<**A**>(`action`: A): *A*

*Defined in [handlers/store.ts:16](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/handlers/store.ts#L16)*

Dispatches action to reducers.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`action` | A |

**Returns:** *A*

___

###  registerMiddleware

▸ **registerMiddleware**<**M**>(...`middlewares`: M[]): *void*

*Defined in [handlers/middleware.ts:13](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/handlers/middleware.ts#L13)*

**Type parameters:**

▪ **M**: *[Middleware](interfaces/middleware.md)*

**Parameters:**

Name | Type |
------ | ------ |
`...middlewares` | M[] |

**Returns:** *void*

___

###  registerReducer

▸ **registerReducer**<**S**, **A**>(`targetKeyPath`: [IterableKeyPath](README.md#iterablekeypath), ...`entries`: [Reducer](interfaces/reducer.md)‹S, A›[]): *[Action](interfaces/action.md)‹string› & object*

*Defined in [handlers/reducers.ts:14](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/handlers/reducers.ts#L14)*

Registers one or more reducers at the given path.

**Type parameters:**

▪ **S**

▪ **A**: *[Action](interfaces/action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`targetKeyPath` | [IterableKeyPath](README.md#iterablekeypath) |
`...entries` | [Reducer](interfaces/reducer.md)‹S, A›[] |

**Returns:** *[Action](interfaces/action.md)‹string› & object*

___

###  removeMiddleware

▸ **removeMiddleware**<**M**>(...`middlewares`: M[]): *void*

*Defined in [handlers/middleware.ts:23](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/handlers/middleware.ts#L23)*

**Type parameters:**

▪ **M**: *[Middleware](interfaces/middleware.md)*

**Parameters:**

Name | Type |
------ | ------ |
`...middlewares` | M[] |

**Returns:** *void*

___

###  removeReducer

▸ **removeReducer**<**S**, **A**>(`targetKeyPath`: [IterableKeyPath](README.md#iterablekeypath), ...`removals`: [Reducer](interfaces/reducer.md)‹S, A›[]): *[Action](interfaces/action.md)‹string› & object*

*Defined in [handlers/reducers.ts:28](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/handlers/reducers.ts#L28)*

Removes an existing reducer by its resolved `KeyPath`.

**Type parameters:**

▪ **S**

▪ **A**: *[Action](interfaces/action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`targetKeyPath` | [IterableKeyPath](README.md#iterablekeypath) |
`...removals` | [Reducer](interfaces/reducer.md)‹S, A›[] |

**Returns:** *[Action](interfaces/action.md)‹string› & object*

___

###  setState

▸ **setState**(`state`: any): *any*

*Defined in [handlers/store.ts:27](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/handlers/store.ts#L27)*

Set the state manually, helpful for providing an initial state.
This should ideally be done before reducers are registered, but is not required.

**Parameters:**

Name | Type |
------ | ------ |
`state` | any |

**Returns:** *any*

## Object literals

### `Const` store

### ▪ **store**: *object*

*Defined in [reference/store.ts:6](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/reference/store.ts#L6)*

###  dispatch

• **dispatch**: *[dispatch](README.md#dispatch)*

*Defined in [reference/store.ts:7](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/reference/store.ts#L7)*

###  getState

▸ **getState**(): *Collection‹any, any›*

*Defined in [reference/store.ts:8](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/reference/store.ts#L8)*

**Returns:** *Collection‹any, any›*

###  observable

▸ **observable**(): *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››*

*Defined in [reference/store.ts:11](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/reference/store.ts#L11)*

**Returns:** *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››*

###  subscribe

▸ **subscribe**(...`args`: any[]): *Subscription*

*Defined in [reference/store.ts:14](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/reference/store.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *Subscription*
