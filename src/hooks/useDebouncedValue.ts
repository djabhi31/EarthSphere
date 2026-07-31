import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value, delaying its update until a specified time has passed
 * without any further changes. Useful for delaying search queries or expensive computations.
 *
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {T} The debounced value.
 *
 * @example
 * const debouncedSearch = useDebouncedValue(searchTerm, 300);
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
