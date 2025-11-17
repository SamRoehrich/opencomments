export interface ContainerOptions {
  className?: string | string[];
  id?: string;
  text?: string;
  innerHTML?: string;
  children?: (HTMLElement | SVGElement)[];
  style?: Partial<CSSStyleDeclaration> | Record<string, string>;
  onClick?: (e: MouseEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  attributes?: Record<string, string>;
}

export const createContainer = (tag: string = "div", options: ContainerOptions = {}): HTMLElement => {
  const container = document.createElement(tag);
  
  if (options.className) {
    const classes = Array.isArray(options.className) 
      ? options.className 
      : [options.className];
    container.className = classes.filter(Boolean).join(" ");
  }
  
  if (options.id) {
    container.id = options.id;
  }
  
  if (options.text) {
    container.textContent = options.text;
  }
  
  if (options.innerHTML) {
    container.innerHTML = options.innerHTML;
  }
  
  if (options.style) {
    Object.assign(container.style, options.style);
  }
  
  if (options.onClick) {
    container.onclick = options.onClick;
  }
  
  if (options.onKeyDown) {
    container.onkeydown = options.onKeyDown;
  }
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      container.setAttribute(key, value);
    });
  }
  
  if (options.children) {
    options.children.forEach(child => container.appendChild(child));
  }
  
  return container;
};

// Convenience functions for common containers
export const createDiv = (options?: ContainerOptions) => createContainer("div", options);
export const createSpan = (options?: ContainerOptions) => createContainer("span", options);
export const createH2 = (options?: ContainerOptions) => createContainer("h2", options);

