import { fromJS, is } from 'immutable';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import promiseMiddleware from 'redux-promise-middleware';

import {
  registerReducer,
  removeReducer,
  registerMiddleware,
  removeMiddleware,
  store,
  action$,
  state$,
  dispatch,
  setState,
  REGISTER_REDUCER,
  REMOVE_REDUCER,
} from '../';

const mockState1 = fromJS({
  r1: { testing: 'reducer1' },
  r2: { nested: { testing: 'reducer_nested' }, second: { testing: 2 } },
});

describe('reducer API', () => {
  describe('registerReducer', () => {
    it(
      'mounts `reducer` to correct `keyPath` in store' +
      ' and initialize w/ `REGISTER_REDUCER` action containing' +
      ' `keyPath` and `reducer` in the action payload',
      () => {
        setState(mockState1);
        const mockKeyPath = ['r2', 'nested'];
        const mockReducer = jest.fn((state, _) => state);
        registerReducer(mockKeyPath, mockReducer);
        expect(mockReducer).toHaveBeenCalledTimes(1);
        const firstCallState = mockReducer.mock.calls[0][0];
        const firstCallAction = mockReducer.mock.calls[0][1];
        expect(firstCallState).toBe(mockState1.getIn(mockKeyPath));
        expect(firstCallAction.type).toBe(REGISTER_REDUCER);
        expect(firstCallAction.payload).toHaveProperty('keyPath');
        expect(firstCallAction.payload.keyPath).toEqual(mockKeyPath);
        expect(firstCallAction.payload).toHaveProperty('entries');
        expect(firstCallAction.payload.entries).toEqual([mockReducer]);
        removeReducer(mockKeyPath);
      },
    );
    it('allows registering a reducer where state is not yet defined', () => {
      setState(mockState1);
      const mockKeyPath = ['r1', 'nested', 'testing'];
      const mockReducer = jest.fn((state, _) => state);
      registerReducer(mockKeyPath, mockReducer);
      expect(mockReducer).toHaveBeenCalledTimes(1);
      const firstCallState = mockReducer.mock.calls[0][0];
      const firstCallAction = mockReducer.mock.calls[0][1];
      expect(firstCallState).toBe(undefined);
      expect(firstCallState).toBe(mockState1.getIn(mockKeyPath));
      expect(firstCallAction.type).toBe(REGISTER_REDUCER);
      expect(firstCallAction.payload).toHaveProperty('keyPath');
      expect(firstCallAction.payload.keyPath).toEqual(mockKeyPath);
      expect(firstCallAction.payload).toHaveProperty('entries');
      expect(firstCallAction.payload.entries).toEqual([mockReducer]);
      const resultState = state$.value;
      expect(resultState.hasIn(mockKeyPath));
      removeReducer(mockKeyPath);
    });
    it(
      'uses the default state for `reducer` if state is not already' +
      ' defined at the given `keyPath`',
      () => {
        setState(mockState1);
        const mockDefaultReducerState = fromJS({ example: 'testing' });
        const mockKeyPath = ['r1', 'nested', 'testing'];
        const mockReducer = jest.fn((state = mockDefaultReducerState) => {
          expect(state).toBe(mockDefaultReducerState);
          return state;
        });
        registerReducer(mockKeyPath, mockReducer);
        expect(mockReducer).toHaveBeenCalledTimes(1);
        const resultState = state$.value.getIn(mockKeyPath);
        expect(resultState).toBe(mockDefaultReducerState);
        removeReducer(mockKeyPath);
      },
    );
    it('throws an error if called within a reducer', () => {
      setState(mockState1);
      const mockKeyPath = ['r2', 'nested'];
      const mockReducer = (state: any) => {
        let didThrow = false;
        try {
          registerReducer(['r2', 'second'], (_) => _);
        } catch (_) {
          didThrow = true;
        } finally {
          expect(didThrow).toBe(true);
        }
        return state;
      };
      registerReducer(mockKeyPath, mockReducer);
      removeReducer(mockKeyPath);
    });
  });
  describe('removeReducer', () => {
    it('dispatches a `REMOVE_REDUCER` action before the reducer is removed from the registry', () => {
      setState(mockState1);
      const mockKeyPath = ['r2', 'nested'];
      const mockReducer = jest.fn((state, _) => state);
      registerReducer(mockKeyPath, mockReducer);
      removeReducer(mockKeyPath);
      expect(mockReducer).toHaveBeenCalledTimes(2);
      const lastCallState = mockReducer.mock.calls[1][0];
      const lastCallAction = mockReducer.mock.calls[1][1];
      expect(lastCallState).toBe(mockState1.getIn(mockKeyPath));
      expect(lastCallAction.type).toBe(REMOVE_REDUCER);
      expect(lastCallAction.payload).toHaveProperty('keyPath');
      expect(lastCallAction.payload.keyPath).toEqual(mockKeyPath);
      expect(lastCallAction.payload).toHaveProperty('entries');
      expect(lastCallAction.payload.entries).toEqual([mockReducer]);
      dispatch({ type: 'SHOULD_NOT_CALL_AGAIN' });
      expect(mockReducer).toHaveBeenCalledTimes(2);
    });
    it('throws an error if called within a reducer', () => {
      setState(mockState1);
      const mockKeyPath = ['r2', 'nested'];
      const mockReducer = (state: any, action: any) => {
        if (action.type === REMOVE_REDUCER) {
          let didThrow = false;
          try {
            removeReducer(mockKeyPath);
          } catch (e) {
            didThrow = true;
          } finally {
            expect(didThrow).toBe(true);
          }
        }
        return state;
      };
      registerReducer(mockKeyPath, mockReducer);
      removeReducer(mockKeyPath);
    });
  });
});
