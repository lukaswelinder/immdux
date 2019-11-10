import { OrderedMap } from 'immutable';

import { Middleware } from '../types';

/** @hidden */
type AnyFunction = (...args: any[]) => any;
/** @hidden */
export const middleware = OrderedMap<Middleware, AnyFunction>().asMutable();
