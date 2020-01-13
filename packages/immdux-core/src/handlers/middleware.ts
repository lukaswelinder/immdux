import { middleware } from '../reference/middleware';
import { store } from './store';
import { dispatchInternal, setDispatchThroughMiddleware } from './dispatch';
import {
  isDispatching,
  isRegisteringMiddleware,
  setIsRegisteringMiddleware,
  ImmduxInternalError,
} from '../reference/status';
import { compose } from '../utils/functional';

import { Dispatch, Middleware } from '../types';

// TODO: improve error handling

export function registerMiddleware<M extends Middleware = Middleware>(...middlewares: M[]) {
  if (isDispatching || isRegisteringMiddleware)
    throw new ImmduxInternalError('Failed to register middleware');
  setIsRegisteringMiddleware(true);
  for (const middlewareConstructor of middlewares)
    middleware.set(middlewareConstructor, middlewareConstructor(store));
  setDispatchThroughMiddleware(<Dispatch<any>>compose(...middleware.values())(dispatchInternal));
  setIsRegisteringMiddleware(false);
}

export function removeMiddleware<M extends Middleware = Middleware>(...middlewares: M[]) {
  if (isDispatching || isRegisteringMiddleware)
    throw new ImmduxInternalError('Failed to remove middleware');
  for (const middlewareConstructor of middlewares) middleware.remove(middlewareConstructor);
  setIsRegisteringMiddleware(true);
  setDispatchThroughMiddleware(<Dispatch<any>>compose(...middleware.values())(dispatchInternal));
  setIsRegisteringMiddleware(false);
}
