import { Map, OrderedSet, getIn, get } from 'immutable';

import { toKeyPathSeq } from './keypath';

import { IterableKeyPath, RegisTreeMap } from '../types';
import { ImmduxInternalError } from '../reference/status';

/** @hidden */
const LISTENER_KEY = {};
/** @hidden */
const NOT_SET = {};

/** @hidden */
export class RegisTree<T = any> {
  private registry: RegisTreeMap<T>;
  private parent: RegisTree<T> | null;
  private parentPath: IterableKeyPath | null;
  private root: RegisTree<T> | null;
  private rootPath: IterableKeyPath | null;
  // TODO: refactor usage of keypath types
  private skipPath?: (path: ReadonlyArray<any>, group: OrderedSet<T>) => boolean;
  private groupPath?: (path: ReadonlyArray<any>, group: OrderedSet<T>) => any;

  // Allow assigning additional properties as needed.
  [key: string]: any;

  // TODO: refactor to not use config obj constructor
  constructor({
    registry = Map().asMutable(),
    parent = null,
    parentPath = null,
    root = null,
    rootPath = null,
    skipPath,
    groupPath,
  }: {
    registry?: RegisTreeMap<T>;
    parent?: RegisTree<T>;
    parentPath?: IterableKeyPath | null;
    root?: RegisTree<T> | null;
    rootPath?: IterableKeyPath | null; // TODO: rename for clarity
    skipPath?: (path: ReadonlyArray<any>, group: OrderedSet<T>) => boolean;
    groupPath?: (path: ReadonlyArray<any>, group: OrderedSet<T>) => any;
  } = {}) {
    this.registry = registry;
    this.parent = parent;
    this.parentPath = parentPath;
    this.root = root || this;
    this.rootPath = rootPath || [];
    this.skipPath = skipPath;
    this.groupPath = groupPath;
  }

  // TODO: defer registry updates to parent to track depth & size ?
  /**
   * Registers values at the given path.
   */
  public register(
    targetKeyPath: IterableKeyPath,
    ...entries: T[]
  ): { keyPath: any[]; entries: T[] } {
    const keyPath = toKeyPathSeq(targetKeyPath).toArray();
    const sentinelKeyPathArray = [...keyPath, LISTENER_KEY];
    if (!entries.length) throw new ImmduxInternalError('No values provided.');
    this.registry.updateIn(
      sentinelKeyPathArray,
      [keyPath, OrderedSet()],
      ([registryPath, registrySet]) => {
        return [registryPath, registrySet.union(entries)];
      },
    );
    return { keyPath, entries };
  }

  /**
   * Removes values at the given path. If no values are provided,
   * then all values at given path will be removed.
   */
  public remove(
    targetKeyPath: IterableKeyPath,
    ...removals: T[]
  ): { keyPath: any[]; entries: T[] } {
    // TODO: throw or log error if path does not exist
    const keyPath = toKeyPathSeq(targetKeyPath).toArray();
    const sentinelKeyPathArr = [...keyPath, LISTENER_KEY];
    let entries = removals;
    if (!removals.length) {
      entries = getIn(this.registry, sentinelKeyPathArr, [keyPath, OrderedSet()])[1].toArray();
      // Remove all values at given path.
      this.registry.removeIn(sentinelKeyPathArr);
    } else {
      // Remove provided values at given path.
      this.registry.updateIn(
        sentinelKeyPathArr,
        [keyPath, OrderedSet()],
        ([registryPath, registrySet]) => {
          return [registryPath, registrySet.subtract(removals)];
        },
      );
      // Clean up empty registry sets.
      const scopedRegistrySet = getIn(this.registry, sentinelKeyPathArr, [
        keyPath,
        OrderedSet(),
      ])[1];
      if (!scopedRegistrySet.size) {
        this.registry.removeIn(sentinelKeyPathArr);
      }
    }
    // Clean up empty registry paths.
    const scopedRegistry = getIn(this.registry, keyPath, Map());
    if (!scopedRegistry.size) {
      this.registry.removeIn(keyPath);
    }
    return { keyPath, entries }; // TODO: only return entries that were actually removed
  }

  /**
   * Returns scoped `RegisTree` instance for given path.
   * If the path does not exist in the registry, scope path will
   * be shortened until it is resolved.
   */
  public scope(keyPath: IterableKeyPath): RegisTree<T> {
    const parentPath = toKeyPathSeq(keyPath).toArray();
    let registryRef: RegisTreeMap<T> = getIn(this.registry, parentPath, NOT_SET);
    while (registryRef === NOT_SET) {
      parentPath.pop();
      registryRef = getIn(this.registry, parentPath, NOT_SET);
    }
    if (!parentPath.length) return this;
    const registry: RegisTreeMap<T> = registryRef;
    const parent = this;
    const root = parent.root;
    const rootPath = parent.rootPath.concat(parentPath);
    const skipPath = root.skipPath;
    const groupPath = root.groupPath;
    return new RegisTree<T>({ registry, parent, parentPath, root, rootPath, skipPath, groupPath });
  }

  /**
   * Iterator traverses entries as (path, value) pairs by default.
   * Use `skipPath` & `groupPath` to customize iteration behavior.
   */
  *[Symbol.iterator]() {
    // TODO: rename ancestor/child iteration vars for clarity
    const { skipPath, groupPath } = this;
    const ancestorArr: [IterableKeyPath, T][] = [];
    if (this.parent !== null) {
      // Iterate ancestors from root.
      const keyQueueArr = [...this.rootPath];
      let registryRef = this.root.registry;
      let registryNodeRef = get(registryRef, LISTENER_KEY, NOT_SET);
      while (keyQueueArr.length > 0) {
        if (registryNodeRef !== NOT_SET) {
          if (skipPath && skipPath(registryNodeRef[0], registryNodeRef[1])) {
            // Early return skipping on ancestor path.
            ancestorArr.reverse();
            return yield* ancestorArr;
          }
          const [registryPath, registrySet] = registryNodeRef;
          if (groupPath) {
            ancestorArr.push([registryPath, groupPath(registryPath, registrySet)]);
          } else {
            for (const value of registrySet) {
              ancestorArr.push([registryPath, value]);
            }
          }
        }
        const key = keyQueueArr.shift();
        registryRef = get(registryRef, key, NOT_SET);
        registryNodeRef = get(registryRef, LISTENER_KEY, NOT_SET);
      }
      // Better performance to push then reverse instead of unshift.
      ancestorArr.reverse();
    }
    // Iterate children depth first.
    const registryNodeArr = [];
    const registryQueue = [this.registry];
    while (registryQueue.length) {
      const registryNode = get(registryQueue[0], LISTENER_KEY, NOT_SET);
      if (registryNode !== NOT_SET) {
        const [registryPath, registrySet] = registryNode;
        if (skipPath && skipPath(registryPath, registrySet)) {
          registryQueue.shift();
          continue;
        }
        if (groupPath) {
          registryNodeArr.push([registryPath, groupPath(registryPath, registrySet)]);
        } else {
          for (const value of registrySet) {
            registryNodeArr.push([registryPath, value]);
          }
        }
      }
      for (const [key, value] of registryQueue[0]) {
        if (key !== LISTENER_KEY) {
          registryQueue.push(value);
        }
      }
      registryQueue.shift();
    }
    registryNodeArr.reverse();
    yield* registryNodeArr;
    yield* ancestorArr;
  }
}
