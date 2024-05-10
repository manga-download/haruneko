// vite.config.ts
import { defineConfig } from "file:///C:/Users/MikeZ/Documents/VisualStudio/Projects/haruneko/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/MikeZ/Documents/VisualStudio/Projects/haruneko/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import react from "file:///C:/Users/MikeZ/Documents/VisualStudio/Projects/haruneko/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { svelte } from "file:///C:/Users/MikeZ/Documents/VisualStudio/Projects/haruneko/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
var buildID = Date.now().toString(36).toUpperCase();
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    react(),
    svelte({
      onwarn: function(warning, handler) {
        return warning.code.startsWith("a11y-") ? void 0 : handler?.call(this, warning);
      }
    })
  ],
  publicDir: "static",
  build: {
    sourcemap: true,
    outDir: "build",
    chunkSizeWarningLimit: 2 * 1024,
    rollupOptions: {
      output: {
        entryFileNames: `${buildID}/[name].js`,
        assetFileNames: `${buildID}/[name].[ext]`,
        chunkFileNames: `${buildID}/[name].js`,
        manualChunks: function(id) {
          if (/\/web\/src\/engine\/websites\//.test(id) && /\/[a-zA-Z0-9_-]+\.webp$/.test(id)) {
            return "WebsiteIcons";
          }
        }
      }
    }
  },
  optimizeDeps: {
    // TODO: once carbon-componenets-svelte v1 is released, check if svelte optimize has been improved
    // carbon-components-svelte is large, prebundle
    include: ["carbon-components-svelte"],
    // carbon-icons-svelte is huge and takes 12s to prebundle, better use deep imports for the icons you need
    exclude: ["carbon-icons-svelte"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNaWtlWlxcXFxEb2N1bWVudHNcXFxcVmlzdWFsU3R1ZGlvXFxcXFByb2plY3RzXFxcXGhhcnVuZWtvXFxcXHdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTWlrZVpcXFxcRG9jdW1lbnRzXFxcXFZpc3VhbFN0dWRpb1xcXFxQcm9qZWN0c1xcXFxoYXJ1bmVrb1xcXFx3ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL01pa2VaL0RvY3VtZW50cy9WaXN1YWxTdHVkaW8vUHJvamVjdHMvaGFydW5la28vd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSc7XHJcblxyXG5jb25zdCBidWlsZElEID0gRGF0ZS5ub3coKS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgdnVlKCksXHJcbiAgICAgICAgcmVhY3QoKSxcclxuICAgICAgICBzdmVsdGUoe1xyXG4gICAgICAgICAgICBvbndhcm46IGZ1bmN0aW9uKHdhcm5pbmcsIGhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3YXJuaW5nLmNvZGUuc3RhcnRzV2l0aCgnYTExeS0nKSA/IHVuZGVmaW5lZCA6IGhhbmRsZXI/LmNhbGwodGhpcywgd2FybmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgIF0sXHJcbiAgICBwdWJsaWNEaXI6ICdzdGF0aWMnLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICAgICAgb3V0RGlyOiAnYnVpbGQnLFxyXG4gICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMiAqIDEwMjQsXHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBgJHtidWlsZElEfS9bbmFtZV0uanNgLFxyXG4gICAgICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGAke2J1aWxkSUR9L1tuYW1lXS5bZXh0XWAsXHJcbiAgICAgICAgICAgICAgICBjaHVua0ZpbGVOYW1lczogYCR7YnVpbGRJRH0vW25hbWVdLmpzYCxcclxuICAgICAgICAgICAgICAgIG1hbnVhbENodW5rczogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoL1xcL3dlYlxcL3NyY1xcL2VuZ2luZVxcL3dlYnNpdGVzXFwvLy50ZXN0KGlkKSAmJiAvXFwvW2EtekEtWjAtOV8tXStcXC53ZWJwJC8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdXZWJzaXRlSWNvbnMnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgICAvLyBUT0RPOiBvbmNlIGNhcmJvbi1jb21wb25lbmV0cy1zdmVsdGUgdjEgaXMgcmVsZWFzZWQsIGNoZWNrIGlmIHN2ZWx0ZSBvcHRpbWl6ZSBoYXMgYmVlbiBpbXByb3ZlZFxyXG4gICAgICAgIC8vIGNhcmJvbi1jb21wb25lbnRzLXN2ZWx0ZSBpcyBsYXJnZSwgcHJlYnVuZGxlXHJcbiAgICAgICAgaW5jbHVkZTogWydjYXJib24tY29tcG9uZW50cy1zdmVsdGUnXSxcclxuICAgICAgICAvLyBjYXJib24taWNvbnMtc3ZlbHRlIGlzIGh1Z2UgYW5kIHRha2VzIDEycyB0byBwcmVidW5kbGUsIGJldHRlciB1c2UgZGVlcCBpbXBvcnRzIGZvciB0aGUgaWNvbnMgeW91IG5lZWRcclxuICAgICAgICBleGNsdWRlOiBbJ2NhcmJvbi1pY29ucy1zdmVsdGUnXVxyXG4gICAgfVxyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQW1YLFNBQVMsb0JBQW9CO0FBQ2haLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxjQUFjO0FBRXZCLElBQU0sVUFBVSxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxZQUFZO0FBR3BELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNILFFBQVEsU0FBUyxTQUFTLFNBQVM7QUFDL0IsZUFBTyxRQUFRLEtBQUssV0FBVyxPQUFPLElBQUksU0FBWSxTQUFTLEtBQUssTUFBTSxPQUFPO0FBQUEsTUFDckY7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxPQUFPO0FBQUEsSUFDSCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUix1QkFBdUIsSUFBSTtBQUFBLElBQzNCLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGdCQUFnQixHQUFHLE9BQU87QUFBQSxRQUMxQixnQkFBZ0IsR0FBRyxPQUFPO0FBQUEsUUFDMUIsZ0JBQWdCLEdBQUcsT0FBTztBQUFBLFFBQzFCLGNBQWMsU0FBUyxJQUFJO0FBQ3ZCLGNBQUksaUNBQWlDLEtBQUssRUFBRSxLQUFLLDBCQUEwQixLQUFLLEVBQUUsR0FBRztBQUNqRixtQkFBTztBQUFBLFVBQ1g7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxjQUFjO0FBQUE7QUFBQTtBQUFBLElBR1YsU0FBUyxDQUFDLDBCQUEwQjtBQUFBO0FBQUEsSUFFcEMsU0FBUyxDQUFDLHFCQUFxQjtBQUFBLEVBQ25DO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
