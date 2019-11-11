[@immdux/core](../README.md) › [AnyAction](anyaction.md)

# Interface: AnyAction <**T**>

Generic action that allows additional properties.
This is useful for situations where metadata may be
added to the action by middleware and you don't want
to bother with defining those properties.

## Type parameters

▪ **T**

## Hierarchy

* [Action](action.md)

  ↳ **AnyAction**

## Indexable

* \[ **key**: *string*\]: any

Generic action that allows additional properties.
This is useful for situations where metadata may be
added to the action by middleware and you don't want
to bother with defining those properties.

## Index

### Properties

* [type](anyaction.md#type)

## Properties

###  type

• **type**: *T*

*Inherited from [Action](action.md).[type](action.md#type)*

*Defined in [types/index.ts:51](https://github.com/lithic-io/immdux/blob/b184a39/packages/immdux-core/src/types/index.ts#L51)*
