import { useCallback, useRef } from 'react';

// Attach the returned callback ref to a scroll container and pair the
// element with the `.pulse-scroll` CSS class. The hook toggles an
// `is-scrolling` class on the element during scroll motion and clears it
// 1s after the last scroll event, giving a macOS-style auto-hide
// scrollbar without any re-renders. `:hover` keeps the scrollbar visible
// while the cursor is over the container (handled in CSS).
//
// Uses a callback ref so consumers with conditional renders (e.g. a list
// that swaps between loading skeleton / error / result divs) re-attach
// cleanly when the target element changes.
export function usePulseScroll<T extends HTMLElement>(): (el: T | null) => void {
  const cleanupRef = useRef<(() => void) | null>(null);
  return useCallback((el: T | null) => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (!el) return;
    let timer: number | undefined;
    const onScroll = () => {
      el.classList.add('is-scrolling');
      if (timer !== undefined) window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove('is-scrolling'), 1000);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    cleanupRef.current = () => {
      el.removeEventListener('scroll', onScroll);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);
}
