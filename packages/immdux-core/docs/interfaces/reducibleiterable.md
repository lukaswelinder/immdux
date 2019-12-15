[@immdux/core](../README.md) › [ReducibleIterable](reducibleiterable.md)

# Interface: ReducibleIterable <**K, V**>

Generic `Iterable` with a `reduce` method.

## Type parameters

▪ **K**

Iterable key type. Defaults to `any`.

▪ **V**

Iterable value type. Defaults to `any`.

## Hierarchy

* Iterable‹V›

  ↳ **ReducibleIterable**

## Indexable

* \[ **key**: *string*\]: any

`IterableKeyPath` may include any additional properties.

## Index

### Methods

* [__@iterator](reducibleiterable.md#__@iterator)
* [reduce](reducibleiterable.md#reduce)

## Methods

###  __@iterator

▸ **__@iterator**(): *Iterator‹V›*

*Inherited from void*

**Returns:** *Iterator‹V›*

___

###  reduce

▸ **reduce**<**R**>(`reducer`: function, `initialReduction?`: R, `context?`: any): *R*

**Type parameters:**

▪ **R**

**Parameters:**

▪ **reducer**: *function*

▸ (`reduction?`: R, `value?`: V, `key?`: K, `iter?`: Collection‹K, V› | Iterable‹V› | V[]): *R*

**Parameters:**

Name | Type |
------ | ------ |
`reduction?` | R |
`value?` | V |
`key?` | K |
`iter?` | Collection‹K, V› &#124; Iterable‹V› &#124; V[] |

▪`Optional`  **initialReduction**: *R*

▪`Optional`  **context**: *any*

**Returns:** *R*
