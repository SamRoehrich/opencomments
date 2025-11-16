export interface ButtonOptions {
  className?: string | string[];
  text?: string;
  innerHTML?: string;
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
  title?: string;
  type?: "button" | "submit" | "reset";
  children?: (HTMLElement | SVGElement)[];
  id?: string;
}

export const createButton = (options: ButtonOptions = {}): HTMLButtonElement => {
  const button = document.createElement("button");
  
  if (options.type) {
    button.type = options.type;
  }
  
  if (options.className) {
    const classes = Array.isArray(options.className) 
      ? options.className 
      : [options.className];
    button.className = classes.filter(Boolean).join(" ");
  }
  
  if (options.text) {
    button.textContent = options.text;
  }
  
  if (options.innerHTML) {
    button.innerHTML = options.innerHTML;
  }
  
  if (options.onClick) {
    button.onclick = options.onClick;
  }
  
  if (options.disabled !== undefined) {
    button.disabled = options.disabled;
  }
  
  if (options.title) {
    button.title = options.title;
  }
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.children) {
    options.children.forEach(child => button.appendChild(child));
  }
  
  return button;
};

