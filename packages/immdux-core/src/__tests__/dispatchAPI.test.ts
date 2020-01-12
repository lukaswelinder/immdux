import { fromJS } from 'immutable';
import promiseMiddleware from 'redux-promise-middleware';

import {
  registerReducer,
  removeReducer,
  registerMiddleware,
  removeMiddleware,
  dispatch,
  setState,
} from '../';

import { Middleware } from '../types';

const mockState1 = fromJS({
  r1: { testing: 'reducer1' },
  r2: { nested: { testing: 'reducer_nested' }, second: { testing: 2 } },
});

describe('dispatch API', () => {
  describe('dispatch', () => {
    it('should throw an error if called within a reducer', () => {
      const mockReducer = (state: any, action: any) => {
        if (action.type === 'SHOULD_ERROR') {
          dispatch({ type: 'WILL_NOT_DISPATCH' });
          return state;
        }
        return state;
      };
      registerReducer([], mockReducer);
      let didError = false;
      try {
        dispatch({ type: 'SHOULD_ERROR' });
      } catch (_) {
        didError = true;
      } finally {
        expect(didError).toBe(true);
        removeReducer([], mockReducer);
      }
    });

    it('should throw an error if called while registering middleware', () => {
      const mockMiddleware = ((_) => (next) => {
        dispatch({ type: 'SHOULD_FAIL'});
        return (action) => {
          next(action);
        };
      }) as Middleware;
      let didError = false;
      try {
        registerMiddleware(mockMiddleware);
      } catch (_) {
        didError = true;
      } finally {
        expect(didError).toBe(true);
        removeMiddleware(mockMiddleware);
      }
    });
  });
});
