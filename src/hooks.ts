import { useReducer, useEffect, EffectCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";


export const useComponentWillMount = (effect: EffectCallback) => {
  const isMounted = useRef(false);

  if (!isMounted.current) {
    effect();
    isMounted.current = true; // Ez biztosítja, hogy az effekt csak egyszer fusson le
  }

  useEffect(() => {
    // Az állapot megmarad, de nem fut újra az effekt az újra renderelésnél
  }, []);
};

export const useComponentWillMount2 = (effect: EffectCallback) => {

  const willMount = useRef(true);

  useComponentDidMount(() => {
    willMount.current = false;
  });

  if (willMount.current) {
    effect();
    willMount.current = false;
  }
};

export const useComponentDidMount = (effect: EffectCallback) => {
  useEffect(effect, []);
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


/**
 * A Redux `useSelector`-based hook that stores the latest value in a ref.
 * This hook now returns the `ref` object.
 */
export const useRefSelector = <T>(selector: (state: any) => T): { value: T, ref: React.RefObject<T> } => {
  const value = useSelector(selector);
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return { value, ref };
}

/**
 * URL Change
 */

interface UseUrlChangeOptions {
  watch?: ('pathname' | 'query' | 'hash')[];
}

interface UseUrlChangeResult {
  url: string;
  pathname: string;
  query: string;
  hash: string;
  count: number;
}

/**
 * Figyeli a window.location részeit (pathname, search, hash),
 * és minden valódi változáskor növeli a count értéket.
 */
export function useUrlChange(options: UseUrlChangeOptions = {}): UseUrlChangeResult {

  const { watch = ['pathname', 'query', 'hash'] } = options;

  const getLocationParts = () => {
    if (typeof window === 'undefined') {
      return { pathname: '', query: '', hash: '', url: '' };
    }
    const { pathname, search, hash, href } = window.location;
    return {
      pathname,
      query: search,
      hash,
      url: href,
    };
  };

  const [state, setState] = useState(() => ({
    ...getLocationParts(),
    count: 0,
  }));

  const prev = useRef(getLocationParts());
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleChange = () => {
      const next = getLocationParts();
      const changed =
        (watch.includes('pathname') && next.pathname !== prev.current.pathname) ||
        (watch.includes('query') && next.query !== prev.current.query) ||
        (watch.includes('hash') && next.hash !== prev.current.hash);

      if (initialized.current && changed) {
        setState({
          ...next,
          count: (prevCount) => (typeof prevCount === 'number' ? prevCount + 1 : 1),
        } as any);
      }

      prev.current = next;
      initialized.current = true;
    };

    // kezeljük a különböző navigációs eseményeket
    const wrap = (method: 'pushState' | 'replaceState') => {
      const original = history[method];
      return function (...args: any[]) {
        const result = original.apply(this, args);
        window.dispatchEvent(new Event(method.toLowerCase()));
        return result;
      };
    };

    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');

    window.addEventListener('popstate', handleChange);
    window.addEventListener('pushstate', handleChange as any);
    window.addEventListener('replacestate', handleChange as any);

    // initial store
    handleChange();

    return () => {
      window.removeEventListener('popstate', handleChange);
      window.removeEventListener('pushstate', handleChange as any);
      window.removeEventListener('replacestate', handleChange as any);
    };
  }, [watch]);

  return state;
}
