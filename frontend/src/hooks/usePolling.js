import { useEffect } from "react";

export const usePolling = (callback, intervalMs = 12000, enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const timer = window.setInterval(() => {
      callback();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [callback, enabled, intervalMs]);
};
