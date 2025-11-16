export interface FormOptions {
  className?: string | string[];
  onSubmit?: (e: SubmitEvent) => void;
  children?: HTMLElement[];
  id?: string;
}

export const createForm = (options: FormOptions = {}): HTMLFormElement => {
  const form = document.createElement("form");
  
  if (options.className) {
    const classes = Array.isArray(options.className) 
      ? options.className 
      : [options.className];
    form.className = classes.filter(Boolean).join(" ");
  }
  
  if (options.onSubmit) {
    form.onsubmit = options.onSubmit;
  }
  
  if (options.id) {
    form.id = options.id;
  }
  
  if (options.children) {
    options.children.forEach(child => form.appendChild(child));
  }
  
  return form;
};

