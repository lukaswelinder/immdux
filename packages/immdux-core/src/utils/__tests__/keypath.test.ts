import { Seq, List, is } from 'immutable';

import { toKeyPathSeq } from '../keypath';

describe('keypath', () => {
  describe('toKeyPathSeq', () => {
    it('should support an array as a keypath', () => {
      const result = toKeyPathSeq(['one', 'two', 'three']);
      expect(result).toBeInstanceOf(Seq.Indexed);
      expect(result.size).toBe(3);
      expect(result.toArray()).toEqual(['one', 'two', 'three']);
    });

    it('should throw an error if keypath is not iterable', () => {
      let didError = false;
      try {
        toKeyPathSeq({} as any);
      } catch (_) {
        didError = true;
      } finally {
        expect(didError).toBe(true);
      }
    });
  });
});
