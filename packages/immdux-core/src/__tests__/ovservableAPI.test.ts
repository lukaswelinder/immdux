import { fromJS, is } from 'immutable';
import { filter } from 'rxjs/operators';

import {
  registerReducer,
  removeReducer,
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

    it('emits an error if subscribed to while reducers are executing', () => {
      setState(mockState1);
      const myAction$ = new ActionObservable();
      let doesError = false;
      const mockReducer = (state: any, action: any) => {
        if (action.type === 'SHOULD_ERROR') {
          myAction$.subscribe({
            error() {
              doesError = true;
            },
          });
        }
        return state;
      };
      registerReducer([], mockReducer);
      dispatch({ type: 'SHOULD_ERROR' });
      expect(doesError).toBe(true);
      removeReducer([], mockReducer);
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

    it('will return a nested observable using `.in()`', () => {
      setState(mockState1);
      const state1$ = new StateObservable(['r1']);
      const state2$ = state1$.in(['nested']);
      const s1 = state1$.subscribe();
      const s2 = state2$.subscribe();
      expect(is(state1$.value, mockState1.getIn(['r1']))).toBe(true);
      expect(is(state2$.value, mockState1.getIn(['r1', 'nested']))).toBe(true);
      s1.unsubscribe();
      s2.unsubscribe();
    });

    it('will return observable at the same level using `.in()` with no arguments', () => {
      setState(mockState1);
      const state1$ = new StateObservable(['r1']);
      const state2$ = state1$.in();
      const s1 = state1$.subscribe();
      const s2 = state2$.subscribe();
      expect(is(state1$.value, mockState1.getIn(['r1']))).toBe(true);
      expect(is(state2$.value, mockState1.getIn(['r1']))).toBe(true);
      s1.unsubscribe();
      s2.unsubscribe();
    });

    it('emits an error if subscribed to while reducers are executing', () => {
      setState(mockState1);
      const myState$ = new StateObservable();
      let doesError = false;
      const mockReducer = (state: any, action: any) => {
        if (action.type === 'SHOULD_ERROR') {
          myState$.subscribe({
            error() {
              doesError = true;
            },
          });
        }
        return state;
      };
      registerReducer([], mockReducer);
      dispatch({ type: 'SHOULD_ERROR' });
      expect(doesError).toBe(true);
      removeReducer([], mockReducer);
    });

    it('emits only once even if there are multiple nested updates', () => {
      setState(mockState1);
      const mockReducer1 = (state: any, action: any) => {
        if (action.type === 'SHOULD_UPDATE') {
          return state.set('testing', 'nested_update');
        }
        return state;
      };
      const mockReducer2 = (state: any, action: any) => {
        if (action.type === 'SHOULD_UPDATE') {
          return state.set('testing', 3);
        }
        return state;
      };
      registerReducer(['r2', 'nested'], mockReducer1);
      registerReducer(['r2', 'second'], mockReducer2);
      const myState$ = new StateObservable(['r2']);
      const mockSubscriber = jest.fn();
      const s = myState$.subscribe(mockSubscriber);
      expect(mockSubscriber).toHaveBeenCalledTimes(1);
      dispatch({ type: 'SHOULD_UPDATE' });
      expect(mockSubscriber).toHaveBeenCalledTimes(2);
      expect(mockSubscriber.mock.calls[1][0]).toEqual(myState$.value);
      s.unsubscribe();
      removeReducer(['r2', 'nested'], mockReducer1);
      removeReducer(['r2', 'second'], mockReducer2);
    });

    it('cleans itself up if unsubscribe is called while queued', () => {
      setState(mockState1);
      const mockReducer = (state: string, action: any) => {
        if (action.type === 'SHOULD_UPDATE') {
          return 'remove_parent';
        }
        return state;
      };
      registerReducer(['r2', 'nested', 'testing'], mockReducer);
      const myState1$ = new StateObservable(['r2']);
      const myState2$ = new StateObservable(['r2', 'nested', 'testing']);
      const mockSubscriber1 = jest.fn();
      const mockSubscriber2 = (value: string) => {
        if (value === 'remove_parent') {
          s1.unsubscribe();
        }
      };
      const s1 = myState1$.subscribe(mockSubscriber1);
      const s2 = myState2$.subscribe(mockSubscriber2);
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      dispatch({ type: 'SHOULD_UPDATE' });
      expect(mockSubscriber1).toHaveBeenCalledTimes(1);
      removeReducer(['r2', 'nested', 'testing'], mockReducer);
      s2.unsubscribe();
    });
  });

  describe('state$', () => {
    it('emits state when changes occur', () => {
      setState(mockState1);
      const mockSubscriber = jest.fn();
      const mockReducer = (state: any, action: any) => {
        if (action.type === 'CHANGE') {
          return state.set('newProp', 'some_value');
        }
        return state;
      };
      registerReducer(['r1'], mockReducer);
      const s = state$.subscribe(mockSubscriber);
      dispatch({ type: 'CHANGE' });
      expect(mockSubscriber).toHaveBeenCalledTimes(2);
      removeReducer(['r1'], mockReducer);
      s.unsubscribe();
    });
  });
});
