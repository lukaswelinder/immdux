import { Seq, isIndexed } from 'immutable';

import { IterableKeyPath } from '../types';

/**
 * Ensures that `keyPath` is `Seq.Indexed`.
 * @hidden
 */
export function toKeyPathSeq(keyPath: IterableKeyPath): Seq.Indexed<any> {
  if (Array.isArray(keyPath) || isIndexed(keyPath)) return Seq.Indexed(keyPath);
  throw new Error('Invalid `keyPath`, must be array-like iterable.');
}
