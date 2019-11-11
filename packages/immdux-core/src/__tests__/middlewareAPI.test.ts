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
});
