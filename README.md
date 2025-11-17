# OpenComments Package

A distributable widget that can be embedded on any website via a script tag.

## Building

```bash
cd packages/package
bun run build
```

This will create:
- `dist/opencomments.js` - IIFE format (for script tag usage)
- `dist/opencomments.css` - Stylesheet
- `dist/index.d.ts` - TypeScript definitions

## Usage

### Script Tag (Vanilla HTML)

#### Basic Usage

Include both the CSS and JavaScript files in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.asyncreview.com/opencomments.css">
</head>
<body>
  <!-- Your content -->
  
  <!-- Load OpenComments at the end of body -->
  <script src="https://cdn.asyncreview.com/opencomments.js"></script>
</body>
</html>
```

The widget will automatically initialize and appear in the top-left corner of the page.

#### Custom API URL

Configure the API URL before the script loads:

```html
<script>
  window.__OPENCOMMENTS_API_URL__ = 'https://api.asyncreview.com';
</script>
<script src="https://cdn.asyncreview.com/opencomments.js"></script>
```

#### Manual Initialization

Disable auto-init and initialize manually:

```html
<script>
  window.OpenComments = {
    config: {
      apiUrl: 'https://api.asyncreview.com',
      autoInit: false
    }
  };
</script>
<script src="https://cdn.asyncreview.com/opencomments.js"></script>
<script>
  // Initialize when ready
  OpenComments.init({
    apiUrl: 'https://api.asyncreview.com'
  });
</script>
```

### React Integration (Avoiding Hydration Errors)

When using OpenComments in a React application, you must ensure it only loads on the client side to avoid hydration mismatches. Here are three recommended approaches:

#### Option 1: Using useEffect Hook (Recommended)

Create a custom hook or component that loads the widget only on the client:

```tsx
import { useEffect } from 'react';

function OpenCommentsWidget() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if already loaded to avoid duplicates
    if ((window as any).OpenComments) {
      return;
    }

    // Load CSS (check if already exists)
    if (!document.querySelector('link[href*="opencomments.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.asyncreview.com/opencomments.css';
      document.head.appendChild(link);
    }

    // Configure API URL before script loads
    (window as any).__OPENCOMMENTS_API_URL__ = 'https://api.asyncreview.com';

    // Load script
    const script = document.createElement('script');
    script.src = 'https://cdn.asyncreview.com/opencomments.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      // Remove widget dialog if it exists
      if ((window as any).OpenComments?.dialog?.remove) {
        (window as any).OpenComments.dialog.remove();
      }
      // Note: We don't remove the script/link tags as they may be used by other components
      // and removing them could cause issues if the component remounts
    };
  }, []);

  // Return null to avoid hydration issues
  return null;
}

// Usage in your app
function App() {
  return (
    <div>
      <YourContent />
      <OpenCommentsWidget />
    </div>
  );
}
```

#### Option 2: Using Dynamic Import with Next.js

For Next.js applications, use dynamic imports with `ssr: false`:

```tsx
import dynamic from 'next/dynamic';

// Dynamically import a component that loads the widget
const OpenCommentsWidget = dynamic(
  () => import('../components/OpenCommentsWidget'),
  { ssr: false }
);

function App() {
  return (
    <div>
      <YourContent />
      <OpenCommentsWidget />
    </div>
  );
}
```

And create `components/OpenCommentsWidget.tsx`:

```tsx
'use client'; // If using Next.js App Router

import { useEffect } from 'react';

export default function OpenCommentsWidget() {
  useEffect(() => {
    // Configure API URL
    (window as any).__OPENCOMMENTS_API_URL__ = 'https://api.asyncreview.com';

    // Load CSS
    if (!document.querySelector('link[href*="opencomments.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.asyncreview.com/opencomments.css';
      document.head.appendChild(link);
    }

    // Load script if not already loaded
    if (!(window as any).OpenComments) {
      const script = document.createElement('script');
      script.src = 'https://cdn.asyncreview.com/opencomments.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup on unmount
      if ((window as any).OpenComments?.dialog?.remove) {
        (window as any).OpenComments.dialog.remove();
      }
    };
  }, []);

  return null;
}
```

#### Option 3: Using Next.js Script Component

For Next.js, you can use the built-in `Script` component along with `Head` for CSS:

```tsx
import Script from 'next/script';
import Head from 'next/head';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Configure API URL before script loads
    (window as any).__OPENCOMMENTS_API_URL__ = 'https://api.asyncreview.com';
  }, []);

  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://cdn.asyncreview.com/opencomments.css" />
      </Head>
      
      <YourContent />
      
      {/* Load script with strategy */}
      <Script
        src="https://cdn.asyncreview.com/opencomments.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
```

Or for Next.js App Router (13+):

```tsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Load CSS
    if (!document.querySelector('link[href*="opencomments.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.asyncreview.com/opencomments.css';
      document.head.appendChild(link);
    }
    
    // Configure API URL
    (window as any).__OPENCOMMENTS_API_URL__ = 'https://api.asyncreview.com';
  }, []);

  return (
    <div>
      <YourContent />
      <Script
        src="https://cdn.asyncreview.com/opencomments.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
```

**Important Notes for React:**
- Always return `null` from the component to avoid hydration mismatches
- Only load the script in `useEffect` (client-side only)
- Clean up event listeners and DOM elements in the cleanup function
- Use `typeof window !== 'undefined'` checks if needed

## API

### `OpenComments.init(options?)`

Initialize OpenComments with optional configuration.

**Options:**
- `apiUrl` (string): The base URL for the OpenComments API
- `autoInit` (boolean): Whether to auto-initialize on load (default: true)

### `OpenComments.setApiUrl(url)`

Update the API base URL after initialization.

## Development

```bash
# Development server
cd packages/package
bun run dev

# Build for production
cd packages/package
bun run build

# Preview build
cd packages/package
bun run preview
```

