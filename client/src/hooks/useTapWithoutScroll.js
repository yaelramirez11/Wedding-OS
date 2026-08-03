import { useCallback, useRef } from "react";

const TAP_MOVE_THRESHOLD_PX = 10;

export function useTapWithoutScroll() {
  const pointerStartRef = useRef(null);

  const handlePointerDown = useCallback((event) => {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const createTapHandler = useCallback((callback) => {
    return (event) => {
      const start = pointerStartRef.current;

      if (!start) {
        return;
      }

      const deltaX = Math.abs(event.clientX - start.x);
      const deltaY = Math.abs(event.clientY - start.y);
      pointerStartRef.current = null;

      if (deltaX > TAP_MOVE_THRESHOLD_PX || deltaY > TAP_MOVE_THRESHOLD_PX) {
        return;
      }

      event.preventDefault();
      callback(event);
    };
  }, []);

  const resetPointer = useCallback(() => {
    pointerStartRef.current = null;
  }, []);

  return {
    handlePointerDown,
    createTapHandler,
    resetPointer,
  };
}
