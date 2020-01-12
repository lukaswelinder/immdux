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

describe('middleware API', () => {
  describe('middleware', () => {
    it('should work', () => {
      setState(mockState1);
      const middleware = promiseMiddleware({
        promiseTypeSuffixes: ['REQUEST', 'SUCCESS', 'FAILURE'],
      });
      let middlewareInnerMock = jest.fn();
      const middlewareOuterMock = jest.fn((api) => {
        middlewareInnerMock = jest.fn(middleware(api));
        return middlewareInnerMock;
      });
      registerMiddleware(middlewareOuterMock);
      expect(middlewareOuterMock).toHaveBeenCalledTimes(1);
      dispatch({ type: 'TEST' });
      expect(middlewareInnerMock).toHaveBeenCalledTimes(1);
      removeMiddleware(middlewareOuterMock);
      dispatch({ type: 'TEST' });
      expect(middlewareInnerMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerReducer', () => {
    it('should throw error if registering or removing middleware while dispatching', () => {
      setState(mockState1);
      const mockReducer = (state: any, action: any) => {
        if (action.type === 'SHOULD_ERROR') {
          registerMiddleware(promiseMiddleware());
        }
        return state;
      };
      registerReducer([], mockReducer);
      let didFail = false;
      try {
        dispatch({ type: 'SHOULD_ERROR' });
      } catch (_) {
        didFail = true;
      } finally {
        expect(didFail).toBe(true);
        removeReducer([], mockReducer);
      }
    });
  });

  describe('registerReducer', () => {
    it('should throw error if registering or removing middleware while dispatching', () => {
      setState(mockState1);
      const mockMiddleware = ((_) => (next) => (action) => {
        next(action);
      }) as Middleware;
      const mockReducer = (state: any, action: any) => {
        if (action.type === 'REGISTER_SHOULD_ERROR') {
          registerMiddleware(mockMiddleware);
        } else if (action.type === 'REMOVE_SHOULD_ERROR') {
          removeMiddleware(mockMiddleware);
        }
        return state;
      };
      registerReducer([], mockReducer);
      let didRegisterFail = false;
      try {
        dispatch({ type: 'REGISTER_SHOULD_ERROR' });
      } catch (_) {
        didRegisterFail = true;
      } finally {
        expect(didRegisterFail).toBe(true);
      }
      let didRemoveFail = false;
      try {
        registerMiddleware(mockMiddleware);
        dispatch({ type: 'REMOVE_SHOULD_ERROR' });
      } catch (_) {
        didRemoveFail = true;
      } finally {
        expect(didRemoveFail).toBe(true);
        removeMiddleware(mockMiddleware);
        removeReducer([], mockReducer);
      }
    });
  });
});
