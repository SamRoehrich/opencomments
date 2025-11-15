import { useEffect } from "react";

interface OpenCommentsWidgetProps {
  scriptUrl?: string;
  apiUrl?: string;
}

export function OpenCommentsWidget({ 
  scriptUrl = "https://pub-2ec8a6bf83b340db84e85806504487f7.r2.dev/opencomments.js",
  apiUrl 
}: OpenCommentsWidgetProps) {
  useEffect(() => {
    // Only run on client side after hydration
    if (typeof window === "undefined") return;

    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      // Script already loaded, just initialize if needed
      if (apiUrl && (window as any).OpenComments) {
        (window as any).OpenComments.setApiUrl(apiUrl);
      }
      return;
    }

    // Set API URL before script loads
    if (apiUrl) {
      (window as any).__OPENCOMMENTS_API_URL__ = apiUrl;
    }

    // Disable auto-init to prevent hydration conflicts
    (window as any).__OPENCOMMENTS_DISABLE_AUTO_INIT__ = true;

    // Create and load script
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Wait for React to finish hydrating before initializing
      // Use multiple requestAnimationFrame calls to ensure React hydration is complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            if ((window as any).OpenComments) {
              // Initialize manually after React hydration is complete
              (window as any).OpenComments.init({ 
                apiUrl,
                autoInit: false // Prevent double initialization
              });
            }
          }, 50); // Small delay to ensure React hydration is complete
        });
      });
    };

    document.body.appendChild(script);

    // Cleanup: remove script on unmount (optional, usually you want to keep it)
    return () => {
      // Only remove if component unmounts and you want to clean up
      // For most cases, you'd want to keep the widget loaded
      // script.remove();
    };
  }, [scriptUrl, apiUrl]);

  // This component doesn't render anything
  return null;
}

