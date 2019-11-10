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


describe('observable API', () => {
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
