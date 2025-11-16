import { createContainer } from "./container";
import type { ContainerOptions } from "./container";

export interface DialogOptions extends ContainerOptions {
  position?: { x: number; y: number };
  centered?: boolean;
  onClose?: () => void;
}

export const createDialog = (options: DialogOptions = {}): HTMLElement => {
  const dialog = createContainer("div", {
    className: options.className,
    id: options.id,
    style: options.style,
    children: options.children,
  });
  
  // Position handling
  if (options.position) {
    dialog.style.position = "fixed";
    dialog.style.left = `${options.position.x}px`;
    dialog.style.top = `${options.position.y}px`;
    
    // Append to body to get dimensions
    document.body.appendChild(dialog);
    
    const dialogRect = dialog.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = options.position.x;
    let top = options.position.y;
    
    // Adjust horizontal position if dialog goes off right edge
    if (dialogRect.right > viewportWidth) {
      left = viewportWidth - dialogRect.width - 8;
      dialog.style.left = `${left}px`;
    }
    
    // Adjust horizontal position if dialog goes off left edge
    if (dialogRect.left < 0) {
      left = 8;
      dialog.style.left = `${left}px`;
    }
    
    // Adjust vertical position if dialog goes off bottom edge
    if (dialogRect.bottom > viewportHeight) {
      top = options.position.y - dialogRect.height - 8;
      dialog.style.top = `${top}px`;
    }
    
    // Adjust vertical position if dialog goes off top edge
    if (dialogRect.top < 0) {
      top = 8;
      dialog.style.top = `${top}px`;
    }
  } else if (options.centered) {
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(dialog);
  } else {
    document.body.appendChild(dialog);
  }
  
  return dialog;
};

