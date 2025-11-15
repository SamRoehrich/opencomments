# OpenComments Package

A distributable widget that can be embedded on any website via a script tag.

## Building

```bash
bun run build
```

This will create:
- `dist/opencomments.js` - IIFE format (for script tag usage)
- `dist/opencomments.css` - Stylesheet
- `dist/index.d.ts` - TypeScript definitions

## Usage

### Basic Usage

Simply include the script tag in your HTML:

```html
<script src="https://cdn.example.com/opencomments.js"></script>
```

The widget will automatically initialize and appear in the top-left corner of the page.

### Custom API URL

Configure the API URL before the script loads:

```html
<script>
  window.__OPENCOMMENTS_API_URL__ = 'https://api.example.com';
</script>
<script src="https://cdn.example.com/opencomments.iife.js"></script>
```

### Manual Initialization

Or initialize manually with options:

```html
<script src="https://cdn.example.com/opencomments.iife.js"></script>
<script>
  OpenComments.init({
    apiUrl: 'https://api.example.com',
    autoInit: false
  });
</script>
```

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
bun run dev

# Build for production
bun run build

# Preview build
bun run preview
```

