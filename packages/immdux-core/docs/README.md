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

___

###  KeyPath

Ƭ **KeyPath**: *[IterableKeyPath](README.md#iterablekeypath)‹K, V› | [PrimitiveKeyPath](README.md#primitivekeypath)*

___

###  PrimitiveKeyPath

Ƭ **PrimitiveKeyPath**: *undefined | null | number | string*

## Variables

### `Const` REGISTER_REDUCER

• **REGISTER_REDUCER**: *string* = "@@immdux/REGISTER_REDUCER"

___

### `Const` REMOVE_REDUCER

• **REMOVE_REDUCER**: *string* = "@@immdux/REMOVE_REDUCER"

___

### `Const` SET_STATE

• **SET_STATE**: *string* = "@@immdux/SET_STATE"

___

### `Const` action$

• **action$**: *[ActionObservable](classes/actionobservable.md)‹[AnyAction](interfaces/anyaction.md)›* =  new ActionObservable()

Root action observable.

___

### `Const` state$

• **state$**: *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››* =  new StateObservable([])

Root state observable.

## Functions

###  dispatch

▸ **dispatch**<**A**>(`action`: A): *A*

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

▸ **setState**(`state`: any): *object*

Set the state manually, helpful for providing an initial state.
This should ideally be done before reducers are registered, but is not required.

**Parameters:**

Name | Type |
------ | ------ |
`state` | any |

**Returns:** *object*

## Object literals

### `Const` store

### ▪ **store**: *object*

###  dispatch

• **dispatch**: *[dispatch](README.md#dispatch)*

###  getState

▸ **getState**(): *Collection‹any, any›*

**Returns:** *Collection‹any, any›*

###  observable

▸ **observable**(): *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››*

**Returns:** *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››*

###  subscribe

▸ **subscribe**(...`args`: any[]): *Subscription*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *Subscription*
