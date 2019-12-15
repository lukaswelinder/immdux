import { fromJS } from 'immutable';
import { filter } from 'rxjs/operators';

import {
  registerReducer,
  ActionObservable,
  StateObservable,
  action$,
  state$,
  dispatch,
  setState,
} from '../';

const mockState1 = fromJS({
  r1: { testing: 'reducer1' },
  r2: { nested: { testing: 'reducer_nested' }, second: { testing: 2 } },
});


describe('observable API', () => {
  describe('ActionObservable', () => {
    it('supports filtering by one or more strings', () => {
      setState(mockState1);
      const mockSubscriber1 = jest.fn();
      const mockSubscriber2 = jest.fn();
      const test1Action$ = new ActionObservable('TEST_1');
      const test2Action$ = new ActionObservable('TEST_1', 'TEST_2');
      const s1 = test1Action$.subscribe(mockSubscriber1);
      const s2 = test2Action$.subscribe(mockSubscriber2);
      dispatch({ type: 'TEST_1', payload: 'hello world' });
      dispatch({ type: 'TEST_2', payload: 'hello world' });
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      expect(mockSubscriber2).toHaveBeenCalledTimes(2);
      s1.unsubscribe();
      s2.unsubscribe();
    });

    it('supports filtering by one or more regex patterns', () => {
      setState(mockState1);
      const mockSubscriber1 = jest.fn();
      const mockSubscriber2 = jest.fn();
      const test1Action$ = new ActionObservable(/.+_1/);
      const test2Action$ = new ActionObservable(/.+_\d/, /.+_ACTION/);
      const s1 = test1Action$.subscribe(mockSubscriber1);
      const s2 = test2Action$.subscribe(mockSubscriber2);
      dispatch({ type: 'TEST_1', payload: 'hello world' });
      dispatch({ type: 'TEST_2', payload: 'hello world' });
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      expect(mockSubscriber2).toHaveBeenCalledTimes(3);
      s1.unsubscribe();
      s2.unsubscribe();
    });

    it('supports filtering by one or more regex patterns and/or strings', () => {
      setState(mockState1);
      const mockSubscriber1 = jest.fn();
      const mockSubscriber2 = jest.fn();
      const test1Action$ = new ActionObservable(/.+_1/);
      const test2Action$ = new ActionObservable(/.+_2/, 'TEST_ACTION');
      const s1 = test1Action$.subscribe(mockSubscriber1);
      const s2 = test2Action$.subscribe(mockSubscriber2);
      dispatch({ type: 'TEST_1', payload: 'hello world' });
      dispatch({ type: 'TEST_2', payload: 'hello world' });
      dispatch({ type: 'TEST_ACTION', payload: 'hello world' });
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      expect(mockSubscriber2).toHaveBeenCalledTimes(2);
      s1.unsubscribe();
      s2.unsubscribe();
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

  describe('StateObservable', () => {
    it('will not emit state to subscribers until connected', () => {
      setState(mockState1);
      const mockSubscriber = jest.fn();
      const mockReducer = jest.fn((state, action) => {
        switch (action.type) {
          case 'TEST_NO_UPDATE':
            return state.setIn(['r1', 'testing'], 'reducer1');
          case 'TEST_UPDATE':
            return state.setIn(['reducer1', 'testing'], 'hello update');
          default:
            return state;
        }
      });
      registerReducer([], mockReducer);
      const myState$ = new StateObservable();
      const s = myState$.subscribe(mockSubscriber);
      dispatch({ type: 'TEST_NO_UPDATE' });
      expect(mockSubscriber).toHaveBeenCalledTimes(1);
      dispatch({ type: 'TEST_UPDATE' });
      expect(mockSubscriber).toHaveBeenCalledTimes(2);
      s.unsubscribe();
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
