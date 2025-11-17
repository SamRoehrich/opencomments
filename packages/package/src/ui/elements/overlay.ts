import { createContainer } from "./container";
import type { ContainerOptions } from "./container";

export interface OverlayOptions extends ContainerOptions {
  zIndex?: number;
  cursor?: string;
  backgroundColor?: string;
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
}

export const createOverlay = (options: OverlayOptions = {}): HTMLElement => {
  const overlay = createContainer("div", {
    style: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: String(options.zIndex || 9997),
      cursor: options.cursor || "default",
      backgroundColor: options.backgroundColor || "transparent",
      pointerEvents: "auto",
      ...options.style,
    },
    attributes: {
      tabindex: "-1",
      ...options.attributes,
    },
  });
  
  if (options.onClick) {
    overlay.onclick = options.onClick;
  }
  
  if (options.onMouseDown) {
    overlay.onmousedown = options.onMouseDown;
  }
  
  if (options.onKeyDown) {
    overlay.onkeydown = options.onKeyDown;
  }
  
  return overlay;
};

