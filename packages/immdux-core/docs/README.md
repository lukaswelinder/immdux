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
* [ofType](README.md#oftype)
* [registerMiddleware](README.md#registermiddleware)
* [registerReducer](README.md#registerreducer)
* [removeMiddleware](README.md#removemiddleware)
* [removeReducer](README.md#removereducer)
* [setState](README.md#setstate)

### Object literals

* [store](README.md#const-store)

## Type aliases

### <a id="iterablekeypath" name="iterablekeypath"></a>  IterableKeyPath

Ƭ **IterableKeyPath**: *[ReducibleIterable](interfaces/reducibleiterable.md)‹K, V›*

___

### <a id="keypath" name="keypath"></a>  KeyPath

Ƭ **KeyPath**: *[IterableKeyPath](README.md#iterablekeypath)‹K, V› | [PrimitiveKeyPath](README.md#primitivekeypath)*

___

### <a id="primitivekeypath" name="primitivekeypath"></a>  PrimitiveKeyPath

Ƭ **PrimitiveKeyPath**: *undefined | null | number | string*

## Variables

### <a id="const-register_reducer" name="const-register_reducer"></a> `Const` REGISTER_REDUCER

• **REGISTER_REDUCER**: *string* = "@@immdux/REGISTER_REDUCER"

___

### <a id="const-remove_reducer" name="const-remove_reducer"></a> `Const` REMOVE_REDUCER

• **REMOVE_REDUCER**: *string* = "@@immdux/REMOVE_REDUCER"

___

### <a id="const-set_state" name="const-set_state"></a> `Const` SET_STATE

• **SET_STATE**: *string* = "@@immdux/SET_STATE"

___

### <a id="const-action$" name="const-action$"></a> `Const` action$

• **action$**: *[ActionObservable](classes/actionobservable.md)‹[AnyAction](interfaces/anyaction.md)›* =  new ActionObservable()

Root action observable. See [ActionObservable docs](classes/actionobservable.md)
for more information.

___

### <a id="const-state$" name="const-state$"></a> `Const` state$

• **state$**: *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››* =  new StateObservable([])

Root state observable. See [StateObservable docs](classes/stateobservable.md)
for more information.

## Functions

### <a id="dispatch" name="dispatch"></a>  dispatch

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

### <a id="oftype" name="oftype"></a>  ofType

▸ **ofType**<**A**>(`types`: string | RegExp[]): *MonoTypeOperatorFunction‹A›*

Observable operator used for filtering action observable by `action.type`.

**Type parameters:**

▪ **A**: *[AnyAction](interfaces/anyaction.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`types` | string &#124; RegExp[] |  One or more strings or regex statements used to filter actions by type.  |

**Returns:** *MonoTypeOperatorFunction‹A›*

___

### <a id="registermiddleware" name="registermiddleware"></a>  registerMiddleware

▸ **registerMiddleware**<**M**>(...`middlewares`: M[]): *void*

**Type parameters:**

▪ **M**: *[Middleware](interfaces/middleware.md)*

**Parameters:**

Name | Type |
------ | ------ |
`...middlewares` | M[] |

**Returns:** *void*

___

### <a id="registerreducer" name="registerreducer"></a>  registerReducer

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

### <a id="removemiddleware" name="removemiddleware"></a>  removeMiddleware

▸ **removeMiddleware**<**M**>(...`middlewares`: M[]): *void*

**Type parameters:**

▪ **M**: *[Middleware](interfaces/middleware.md)*

**Parameters:**

Name | Type |
------ | ------ |
`...middlewares` | M[] |

**Returns:** *void*

___

### <a id="removereducer" name="removereducer"></a>  removeReducer

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

### <a id="setstate" name="setstate"></a>  setState

▸ **setState**(`state`: any): *object*

Set the state manually, helpful for providing an initial state.
This should ideally be done before reducers are registered, but is not required.

**Parameters:**

Name | Type |
------ | ------ |
`state` | any |

**Returns:** *object*

## Object literals

### <a id="const-store" name="const-store"></a> `Const` store

### ▪ **store**: *object*

### <a id="dispatch" name="dispatch"></a>  dispatch

• **dispatch**: *[dispatch](README.md#dispatch)*

### <a id="getstate" name="getstate"></a>  getState

▸ **getState**(): *Collection‹any, any›*

**Returns:** *Collection‹any, any›*

### <a id="observable" name="observable"></a>  observable

▸ **observable**(): *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››*

**Returns:** *[StateObservable](classes/stateobservable.md)‹Collection‹any, any››*

### <a id="subscribe" name="subscribe"></a>  subscribe

▸ **subscribe**(...`args`: any[]): *Subscription*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *Subscription*
