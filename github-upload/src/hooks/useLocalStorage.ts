import { useCallback, useRef, useState } from 'react';

// Persist before publishing state. A failed write must not silently appear saved.
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    if (item !== null) return JSON.parse(item) as T;
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });
  const current = useRef(storedValue);
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    const next = typeof value === 'function' ? (value as (prev: T) => T)(current.current) : value;
    window.localStorage.setItem(key, JSON.stringify(next));
    current.current = next;
    setStoredValue(next);
  }, [key]);
  return [storedValue, setValue];
}
