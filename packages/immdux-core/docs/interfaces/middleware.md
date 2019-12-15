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

▸ (`next`: D): *function*

**Parameters:**

Name | Type |
------ | ------ |
`next` | D |

▸ (`action`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`action` | any |
