"use client";
export function debounced(callback: () => void, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}
