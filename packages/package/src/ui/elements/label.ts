export interface LabelOptions {
  className?: string | string[];
  text?: string;
  htmlFor?: string;
  children?: HTMLElement[];
}

export const createLabel = (options: LabelOptions = {}): HTMLLabelElement => {
  const label = document.createElement("label");
  
  if (options.className) {
    const classes = Array.isArray(options.className) 
      ? options.className 
      : [options.className];
    label.className = classes.filter(Boolean).join(" ");
  }
  
  if (options.text) {
    label.textContent = options.text;
  }
  
  if (options.htmlFor) {
    label.htmlFor = options.htmlFor;
  }
  
  if (options.children) {
    options.children.forEach(child => label.appendChild(child));
  }
  
  return label;
};

