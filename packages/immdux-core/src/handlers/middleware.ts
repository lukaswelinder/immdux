import { middleware } from '../reference/middleware';
import { store } from '../reference/store';
import { dispatchInternal, setDispatchThroughMiddleware } from './store';
import {
  isDispatching,
  isRegisteringMiddleware,
  setIsRegisteringMiddleware,
} from '../reference/status';
import { compose } from '../utils/functional';

import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from '../types';

export function registerMiddleware<M extends Middleware = Middleware>(...middlewares: M[]) {
  if (isDispatching) throw new Error('Registering middleware from reducer is forbidden.');
  const calledByMiddlewareConstructor = isRegisteringMiddleware;
  !calledByMiddlewareConstructor && setIsRegisteringMiddleware(true);
  for (const middlewareConstructor of middlewares)
    middleware.set(middlewareConstructor, middlewareConstructor(store));
  setDispatchThroughMiddleware(<Dispatch<any>>compose(...middleware.values())(dispatchInternal));
  !calledByMiddlewareConstructor && setIsRegisteringMiddleware(false);
}

export function removeMiddleware<M extends Middleware = Middleware>(...middlewares: M[]) {
  if (isDispatching) throw new Error('Registering middleware from reducer is forbidden.');
  for (const middlewareConstructor of middlewares) middleware.remove(middlewareConstructor);
  setDispatchThroughMiddleware(<Dispatch<any>>compose(...middleware.values())(dispatchInternal));
}
