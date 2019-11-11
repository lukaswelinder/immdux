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
  ActionObservable,
  StateObservable,
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


describe('observable API', () => {
  describe('ActionObservable', () => {
    it('will not emit actions until connected', () => {
      setState(mockState1);
      const mockSubscriber = jest.fn();
      const myAction$ = new ActionObservable();
      const s = myAction$.subscribe(mockSubscriber);
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber).toHaveBeenCalledTimes(0);
      const c = myAction$.connect();
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber).toHaveBeenCalledTimes(1);
      s.unsubscribe();
      c.unsubscribe();
    });

    it('supports filtering by one or more strings', () => {
      setState(mockState1);
      const mockSubscriber1 = jest.fn();
      const mockSubscriber2 = jest.fn();
      const test1Action$ = new ActionObservable('TEST_1');
      const test2Action$ = new ActionObservable('TEST_1', 'TEST_2');
      const s1 = test1Action$.subscribe(mockSubscriber1);
      const s2 = test2Action$.subscribe(mockSubscriber2);
      const c1 = test1Action$.connect();
      const c2 = test2Action$.connect();
      dispatch({ type: 'TEST_1', payload: 'hello world' });
      dispatch({ type: 'TEST_2', payload: 'hello world' });
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      expect(mockSubscriber2).toHaveBeenCalledTimes(2);
      s1.unsubscribe();
      s2.unsubscribe();
      c1.unsubscribe();
      c2.unsubscribe();
    });

    it('supports filtering by one or more regex patterns', () => {
      setState(mockState1);
      const mockSubscriber1 = jest.fn();
      const mockSubscriber2 = jest.fn();
      const test1Action$ = new ActionObservable(/.+_1/);
      const test2Action$ = new ActionObservable(/.+_\d/, /.+_ACTION/);
      const s1 = test1Action$.subscribe(mockSubscriber1);
      const s2 = test2Action$.subscribe(mockSubscriber2);
      const c1 = test1Action$.connect();
      const c2 = test2Action$.connect();
      dispatch({ type: 'TEST_1', payload: 'hello world' });
      dispatch({ type: 'TEST_2', payload: 'hello world' });
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      expect(mockSubscriber2).toHaveBeenCalledTimes(3);
      s1.unsubscribe();
      s2.unsubscribe();
      c1.unsubscribe();
      c2.unsubscribe();
    });

    it('supports filtering by one or more regex patterns and/or strings', () => {
      setState(mockState1);
      const mockSubscriber1 = jest.fn();
      const mockSubscriber2 = jest.fn();
      const test1Action$ = new ActionObservable(/.+_1/);
      const test2Action$ = new ActionObservable(/.+_\d/, 'TEST_ACTION');
      const s1 = test1Action$.subscribe(mockSubscriber1);
      const s2 = test2Action$.subscribe(mockSubscriber2);
      const c1 = test1Action$.connect();
      const c2 = test2Action$.connect();
      dispatch({ type: 'TEST_1', payload: 'hello world' });
      dispatch({ type: 'TEST_2', payload: 'hello world' });
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      expect(mockSubscriber2).toHaveBeenCalledTimes(3);
      s1.unsubscribe();
      s2.unsubscribe();
      c1.unsubscribe();
      c2.unsubscribe();
    });
  });

  describe('action$', () => {
    it('emits any action dispatched after subscribing', () => {
      setState(mockState1);
      const mockSubscriber1 = jest.fn();
      const mockSubscriber2 = jest.fn();
      const s1 = action$.subscribe(mockSubscriber1);
      const s2 = action$.pipe(filter((a) => a.type !== 'TEST_ACTION')).subscribe(mockSubscriber2);
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      expect(mockSubscriber2).toHaveBeenCalledTimes(0);
      s1.unsubscribe();
      s2.unsubscribe();
    });
  });
  describe('state$', () => {
    it('emits state when changes occur', () => {
      setState(mockState1);
      const mockSubscriber = jest.fn();
      registerReducer(['r1'], (state, action) => {
        if (action.type === 'CHANGE') {
          return state.set('newProp', 'some_value');
        }
        return state;
      });
      const s = state$.subscribe(mockSubscriber);
      dispatch({ type: 'CHANGE' });
      expect(mockSubscriber).toHaveBeenCalledTimes(2);
      s.unsubscribe();
    });
  });
});
