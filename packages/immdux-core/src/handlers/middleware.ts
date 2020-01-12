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

export function registerMiddleware<M extends Middleware = Middleware>(...middlewares: M[]) {
  if (isDispatching) throw new ImmduxInternalError('Registering middleware from reducer is forbidden.');
  const calledByMiddlewareConstructor = isRegisteringMiddleware;
  !calledByMiddlewareConstructor && setIsRegisteringMiddleware(true);
  for (const middlewareConstructor of middlewares)
    middleware.set(middlewareConstructor, middlewareConstructor(store));
  setDispatchThroughMiddleware(<Dispatch<any>>compose(...middleware.values())(dispatchInternal));
  !calledByMiddlewareConstructor && setIsRegisteringMiddleware(false);
}

export function removeMiddleware<M extends Middleware = Middleware>(...middlewares: M[]) {
  if (isDispatching) throw new ImmduxInternalError('Removing middleware from reducer is forbidden.');
  for (const middlewareConstructor of middlewares) middleware.remove(middlewareConstructor);
  setDispatchThroughMiddleware(<Dispatch<any>>compose(...middleware.values())(dispatchInternal));
}
