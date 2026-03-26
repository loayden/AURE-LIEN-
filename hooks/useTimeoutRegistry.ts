"use client";

import { useCallback, useEffect, useRef } from "react";

export function useTimeoutRegistry() {
  const timeoutIdsRef = useRef<number[]>([]);

  const clearRegisteredTimeouts = useCallback(() => {
    for (const timeoutId of timeoutIdsRef.current) {
      window.clearTimeout(timeoutId);
    }
    timeoutIdsRef.current = [];
  }, []);

  const registerTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== timeoutId);
      callback();
    }, delay);

    timeoutIdsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  useEffect(() => clearRegisteredTimeouts, [clearRegisteredTimeouts]);

  return {
    clearRegisteredTimeouts,
    registerTimeout,
  };
}
