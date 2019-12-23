[@immdux/core](../README.md) › [Middleware](middleware.md)

# Interface: Middleware <**DispatchExt, S, D**>

## Type parameters

▪ **DispatchExt**

▪ **S**

▪ **D**: *[Dispatch](dispatch.md)*

## Hierarchy

* **Middleware**

## Callable

▸ (`api`: [MiddlewareAPI](middlewareapi.md)‹D, S›): *function*

**Parameters:**

Name | Type |
------ | ------ |
`api` | [MiddlewareAPI](middlewareapi.md)‹D, S› |

**Returns:** *function*

▸ (`next`: [Dispatch](dispatch.md)‹[AnyAction](anyaction.md)›): *function*

**Parameters:**

Name | Type |
------ | ------ |
`next` | [Dispatch](dispatch.md)‹[AnyAction](anyaction.md)› |

▸ (`action`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`action` | any |
