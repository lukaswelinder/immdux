import { compose } from '../functional';

describe('functional', () => {
  describe('compose', () => {
    it('should return a pass-through function if no arguments are provided', () => {
      const composedFn = compose();
      expect(typeof composedFn).toBe('function');
      expect(composedFn('hello world')).toBe('hello world');
    });

    it('should return the argument if only one is provided', () => {
      const mockFnArg = () => 'hello world';
      const composedFn = compose(mockFnArg);
      expect(composedFn).toBe(mockFnArg);
    });

    it(
      'should return a fn that calls argument functions right to left;' +
        ' all arguments are passed to first fn called;' +
        ' subsequent fns receive the return from previous fns',
      () => {
        const mockFn1 = jest.fn(() => 'hello world');
        const mockFn2 = jest.fn(() => 'test');
        const composedFn = compose(mockFn1, mockFn2);
        const result = composedFn(1, 2, 3);
        expect(result).toBe('hello world');
        expect(mockFn2).toHaveBeenCalledTimes(1);
        expect(mockFn2).toHaveBeenCalledWith(1, 2, 3);
        expect(mockFn1).toHaveBeenCalledTimes(1);
        expect(mockFn1).toHaveBeenCalledWith('test');
      },
    );
  });
});
