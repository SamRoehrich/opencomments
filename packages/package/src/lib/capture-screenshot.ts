import html2canvas from 'html2canvas';

/**
 * Captures a screenshot of the current viewport
 * @returns A base64-encoded PNG image string, or null if capture fails
 */
export async function captureViewportScreenshot(): Promise<string | null> {
  try {
    // Find and temporarily hide UI overlay elements (comment forms, widgets, etc.)
    const hiddenElements: { element: HTMLElement; originalVisibility: string }[] = [];
    
    // Hide comment forms (high z-index fixed elements)
    const commentForms = document.querySelectorAll('[style*="z-index: 10000"]');
    commentForms.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.visibility !== 'hidden' && htmlEl.style.display !== 'none') {
        hiddenElements.push({
          element: htmlEl,
          originalVisibility: htmlEl.style.visibility || 'visible'
        });
        htmlEl.style.visibility = 'hidden';
      }
    });
    
    // Hide widget (the comment creation button)
    const widgets = document.querySelectorAll('[style*="position: absolute"]');
    widgets.forEach((el) => {
      const htmlEl = el as HTMLElement;
      // Check if it's likely the widget (small circular element in top-left)
      const rect = htmlEl.getBoundingClientRect();
      if (rect.width <= 50 && rect.height <= 50 && 
          htmlEl.style.visibility !== 'hidden' && 
          htmlEl.style.display !== 'none') {
        hiddenElements.push({
          element: htmlEl,
          originalVisibility: htmlEl.style.visibility || 'visible'
        });
        htmlEl.style.visibility = 'hidden';
      }
    });

    // Capture the viewport
    const canvas = await html2canvas(document.body, {
      width: window.innerWidth,
      height: window.innerHeight,
      useCORS: true,
      logging: false,
      scale: 1,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      backgroundColor: '#ffffff',
    });

    // Restore visibility of hidden elements
    hiddenElements.forEach(({ element, originalVisibility }) => {
      element.style.visibility = originalVisibility;
    });

    // Convert canvas to base64
    const base64Image = canvas.toDataURL('image/png');
    return base64Image;
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    return null;
  }
}

