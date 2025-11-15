import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "OpenComments",
      fileName: (format) => {
        // For IIFE format, output as .js (standard for script tags)
        if (format === "iife") {
          return "opencomments.js";
        }
        return `opencomments.${format}.js`;
      },
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        extend: true,
        exports: "named",
        // Inline CSS into the JS bundle for script tag usage
        inlineDynamicImports: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "opencomments.css";
          }
          return assetInfo.name || "asset";
        },
      },
    },
    minify: true,
    sourcemap: true,
    cssCodeSplit: false,
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

