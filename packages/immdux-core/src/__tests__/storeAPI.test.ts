import { fromJS, is } from 'immutable';
import { Observable, Subscription } from 'rxjs';

import {
  store,
  setState,
  dispatch,
  registerReducer,
  removeReducer,
} from '../';

const mockState1 = fromJS({
  r1: { testing: 'reducer1' },
  r2: { nested: { testing: 'reducer_nested' }, second: { testing: 2 } },
});

describe('store API', () => {
  describe('store', () => {
    it('should allow accessing state via `.getState()` method', () => {
      setState(mockState1);
      expect(is(store.getState(), mockState1)).toBe(true);
    });

    it('should return an instance of `RxJS.Observable` from `.observable()` method', () => {
      setState(mockState1);
      expect(store.observable()).toBeInstanceOf(Observable);
    });

    it('should allow subscribing to state updates via `.subscribe()` method', () => {
      setState(mockState1);
      const mockReducer = (state: any, action: any) => {
        if (action.type === 'SHOULD_UPDATE') {
          return state.setIn(['second', 'nested', 'testing'], 3);
        }
        return state;
      };
      registerReducer([], mockReducer);
      const mockSubscriber = jest.fn();
      const s = store.subscribe(mockSubscriber);
      expect(s).toBeInstanceOf(Subscription);
      expect(mockSubscriber).toHaveBeenCalledTimes(1);
      dispatch({ type: 'DO_NOT_UPDATE' });
      dispatch({ type: 'SHOULD_UPDATE' });
      expect(mockSubscriber).toHaveBeenCalledTimes(2);
      s.unsubscribe();
      removeReducer([], mockReducer);
    });

    it('should dispatch actions via `.dispatch()` method', () => {
      setState(mockState1);
      const mockReducer = jest.fn((state: any, _) => state);
      registerReducer([], mockReducer);
      store.dispatch({ type: 'TEST_DISPATCH' });
      expect(mockReducer).toHaveBeenCalledTimes(2);
      expect(mockReducer.mock.calls[1][1]).toEqual({ type: 'TEST_DISPATCH' });
      removeReducer([], mockReducer);
    });
  });
});
