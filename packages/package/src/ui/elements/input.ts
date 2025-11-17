export interface InputOptions {
  type?: string;
  className?: string | string[];
  placeholder?: string;
  value?: string;
  id?: string;
  name?: string;
  required?: boolean;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
}

export const createInput = (options: InputOptions = {}): HTMLInputElement => {
  const input = document.createElement("input");
  
  if (options.type) {
    input.type = options.type;
  } else {
    input.type = "text";
  }
  
  if (options.className) {
    const classes = Array.isArray(options.className) 
      ? options.className 
      : [options.className];
    input.className = classes.filter(Boolean).join(" ");
  }
  
  if (options.placeholder) {
    input.placeholder = options.placeholder;
  }
  
  if (options.value !== undefined) {
    input.value = options.value;
  }
  
  if (options.id) {
    input.id = options.id;
  }
  
  if (options.name) {
    input.name = options.name;
  }
  
  if (options.required !== undefined) {
    input.required = options.required;
  }
  
  if (options.onInput) {
    input.addEventListener("input", options.onInput);
  }
  
  if (options.onChange) {
    input.addEventListener("change", options.onChange);
  }
  
  return input;
};

