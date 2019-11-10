/** @hidden */
export let isRegisteringMiddleware: boolean = false;
/** @hidden */
export function setIsRegisteringMiddleware(val: boolean): void {
  isRegisteringMiddleware = val;
}

/** @hidden */
export let isDispatching: boolean = false;
/** @hidden */
export function setIsDispatching(val: boolean): void {
  isDispatching = val;
}
