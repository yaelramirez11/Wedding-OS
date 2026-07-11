import { useIsMobile } from "./useIsMobile.js";
import { useTouchDevice } from "./useTouchDevice.js";

export function usePrefersTapLayout() {
  const isMobile = useIsMobile();
  const isTouch = useTouchDevice();

  return isMobile || isTouch;
}
