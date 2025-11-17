/**
 * Adds Command+Enter (Mac) or Ctrl+Enter (Windows/Linux) keyboard shortcut
 * to submit forms in dialogs. Automatically finds submit buttons and form inputs.
 * 
 * @param dialog - The dialog element containing the form
 * @param submitButton - Optional specific submit button. If not provided, will search for one.
 * @returns Cleanup function to remove all listeners
 */
export const addDialogSubmitShortcut = (
  dialog: HTMLElement,
  submitButton?: HTMLButtonElement
): (() => void) => {
  // Find submit button if not provided
  let submitBtn = submitButton;
  if (!submitBtn) {
    // Look for common submit button patterns
    submitBtn = dialog.querySelector(
      'button[type="submit"], ' +
      '.opencomments-review-button--create, ' +
      '.opencomments-settings-button--save, ' +
      '.opencomments-create-form-button--submit, ' +
      '.opencomments-submit-comment-button'
    ) as HTMLButtonElement;
  }

  if (!submitBtn) {
    console.warn('No submit button found in dialog');
    return () => {}; // Return no-op cleanup function
  }

  // Find all form inputs (input, textarea, select)
  const formInputs = Array.from(
    dialog.querySelectorAll('input, textarea, select')
  ) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];

  // Keyboard shortcut handler
  const handleSubmitShortcut = (event: KeyboardEvent) => {
    // Check for Enter key
    if (event.key === "Enter" || event.keyCode === 13) {
      // Check for Command (Mac) or Ctrl (Windows/Linux)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isModifierPressed = isMac ? event.metaKey : event.ctrlKey;
      
      if (isModifierPressed) {
        event.preventDefault();
        event.stopPropagation();
        // Trigger submit button click
        submitBtn!.click();
      }
    }
  };

  // Add listeners to all form inputs
  formInputs.forEach(input => {
    input.addEventListener('keydown', handleSubmitShortcut as EventListener);
  });

  // Return cleanup function
  return () => {
    formInputs.forEach(input => {
      input.removeEventListener('keydown', handleSubmitShortcut as EventListener);
    });
  };
};

