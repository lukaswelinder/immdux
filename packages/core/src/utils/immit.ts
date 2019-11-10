import { Map, OrderedSet, getIn, is } from 'immutable';

import { RegisTree } from './registree';
import { toKeyPathSeq } from './keypath';

import { IterableKeyPath, ImmitListener } from '../types';

const NOT_SET = {};

/**
 * @hidden
 */
export class Immit {
  // Current data root.
  public current: any;
  // Previous & next state references.
  private prev: any;
  private next: any;
  // Listener registry.
  private listeners: RegisTree<ImmitListener>;

  constructor(data = Map()) {
    this.current = data;
    this.listeners = new RegisTree({
      skipPath: this.skipPath,
      groupPath: this.groupPath,
    });
  }

  private changeListener = (newRoot: any, oldRoot: any, path: any[]): void => {
    this.current = newRoot;
    this.prev = oldRoot;
    this.next = newRoot;
    if (!is(getIn(newRoot, path, NOT_SET), getIn(oldRoot, path, NOT_SET))) {
      const listeners = path ? this.listeners.scope(path) : this.listeners;
      for (const [_, cb] of listeners) cb();
    }
  };

  private skipPath = (path: IterableKeyPath): boolean => {
    return is(getIn(this.prev, path, 'a'), getIn(this.next, path, 'b'));
  };

  private groupPath = (
    path: IterableKeyPath,
    listenerSet: OrderedSet<ImmitListener>,
  ): (() => void) => {
    const prev = getIn(this.prev, path, undefined);
    const next = getIn(this.next, path, undefined);
    const queueSize = listenerSet.size;
    const queue: (() => void)[] = [];
    for (const fn of listenerSet) {
      queue.push(() => {
        fn(next, prev, path as ReadonlyArray<any>); // TODO: consider passing path directly to avoid copies
      });
    }
    return () => {
      for (let i = 0; i < queueSize; i++) queue[i]();
    };
  };

  // TODO: consider exposing update methods w/ a `flushUpdates` method

  public updateIn(path: any[], updater: (value: any) => any): any {
    const oldRoot = this.current;
    const newRoot = this.current.updateIn(path, updater);
    this.changeListener(newRoot, oldRoot, path);
    return this.current;
  }

  public update(updater: (value: any) => any): any {
    const oldRoot = this.current;
    const newRoot = this.current.update(updater);
    this.changeListener(newRoot, oldRoot, []);
    return this.current;
  }

  // TODO: make key path types more specific and clearly documented
  public subscribe(
    targetKeyPath: IterableKeyPath = [],
    fn: ImmitListener,
  ): () => { keyPath: IterableKeyPath; entries: ImmitListener[] } {
    // TODO: consider making path an optional arg
    const keyPath = toKeyPathSeq(targetKeyPath).toArray();
    this.listeners.register(targetKeyPath, fn);
    return () => this.listeners.remove(keyPath, fn);
  }
}
