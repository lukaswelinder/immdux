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

*Defined in [types/index.ts:73](https://github.com/lukaswelinder/immdux/blob/1b2329f/packages/core/src/types/index.ts#L73)*

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
