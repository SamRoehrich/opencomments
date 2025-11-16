export interface TextareaOptions {
  className?: string | string[];
  placeholder?: string;
  value?: string;
  id?: string;
  name?: string;
  rows?: number;
  cols?: number;
  required?: boolean;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
}

export const createTextarea = (options: TextareaOptions = {}): HTMLTextAreaElement => {
  const textarea = document.createElement("textarea");
  
  if (options.className) {
    const classes = Array.isArray(options.className) 
      ? options.className 
      : [options.className];
    textarea.className = classes.filter(Boolean).join(" ");
  }
  
  if (options.placeholder) {
    textarea.placeholder = options.placeholder;
  }
  
  if (options.value !== undefined) {
    textarea.value = options.value;
  }
  
  if (options.id) {
    textarea.id = options.id;
  }
  
  if (options.name) {
    textarea.name = options.name;
  }
  
  if (options.rows) {
    textarea.rows = options.rows;
  }
  
  if (options.cols) {
    textarea.cols = options.cols;
  }
  
  if (options.required !== undefined) {
    textarea.required = options.required;
  }
  
  if (options.onInput) {
    textarea.addEventListener("input", options.onInput);
  }
  
  if (options.onChange) {
    textarea.addEventListener("change", options.onChange);
  }
  
  return textarea;
};

