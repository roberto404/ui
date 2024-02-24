import { useReducer, useEffect, EffectCallback, useRef } from "react"

export const useComponentWillMount = (effect: EffectCallback) => {

  const willMount = useRef(true)

  if (willMount.current)
    effect()

  willMount.current = false
}

export const useComponentDidMount = (effect: EffectCallback) => {
  useEffect(effect, [])
}

export const useHookUpdateProps = (callback, dependencies) => {

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const callbackWithProps = useRef((...args) => {
    if (callbackRef.current) {
      callbackRef.current(...args);
    }
  });

  useEffect(() => {
    callbackWithProps.current();
  }, dependencies);

  return (...args) => callbackWithProps.current(...args);
}

export const useForceUpdate = () => {
  return useReducer(() => ({}), {})[1] as () => void
}

export const useComponentWillUnmount = (effect: EffectCallback) => {
  useEffect(() => effect, [])
}