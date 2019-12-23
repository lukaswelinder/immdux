[@immdux/core](../README.md) › [ActionObservable](actionobservable.md)

# Class: ActionObservable <**A**>

The `ActionObservable` is a simple observable that emits actions.

Actions are emitted after state observables. This makes the
action observable useful for scheduling updates.

```ts
import { Observable, combineLatest } from 'rxjs';
import { sample } from 'rxjs/operators';
import { action$, state$ } from '@immdux/core';

interface ChatError {}
interface ChatMessage {}
interface User {}
type ChatObservable = Observable<[ChatError, ChatMessage[], User]>;

const chatError$ = state$.in(['chat', 'error']);
const chatMessages$ = state$.in(['chat', 'messages']);
const usersOnline$ = state$.in(['session', 'users', 'onlineList']);

const chat$: ChatObservable = combineLatest(
  chatError$,
  chatMessages,
  usersOnline$,
).pipe(sample(action$));
```

**`param`** 
One or more strings or regex statements used to filter actions by type.

## Type parameters

▪ **A**: *[AnyAction](../interfaces/anyaction.md)*

## Hierarchy

* Observable‹A›

  ↳ **ActionObservable**

## Implements

* Subscribable‹A›

## Index

### Constructors

* [constructor](actionobservable.md#constructor)

## Constructors

###  constructor

\+ **new ActionObservable**(...`types`: string | RegExp[]): *[ActionObservable](actionobservable.md)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`...types` | string &#124; RegExp[] |

**Returns:** *[ActionObservable](actionobservable.md)*
