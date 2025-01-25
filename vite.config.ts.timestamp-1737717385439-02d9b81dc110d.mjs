// vite.config.ts
import { defineConfig } from "file:///D:/Notes/MFSc/3rd%20Sem/Website/Aquaculture_Tool/aquaculture-tools/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Notes/MFSc/3rd%20Sem/Website/Aquaculture_Tool/aquaculture-tools/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 3e3,
    hmr: {
      protocol: "ws",
      host: "localhost"
    },
    open: true
    // This will automatically open the browser
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@emotion/react",
      "@emotion/styled",
      "@mui/material",
      "@mui/icons-material"
    ],
    force: true
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          mui: ["@mui/material", "@mui/icons-material"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxOb3Rlc1xcXFxNRlNjXFxcXDNyZCBTZW1cXFxcV2Vic2l0ZVxcXFxBcXVhY3VsdHVyZV9Ub29sXFxcXGFxdWFjdWx0dXJlLXRvb2xzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxOb3Rlc1xcXFxNRlNjXFxcXDNyZCBTZW1cXFxcV2Vic2l0ZVxcXFxBcXVhY3VsdHVyZV9Ub29sXFxcXGFxdWFjdWx0dXJlLXRvb2xzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Ob3Rlcy9NRlNjLzNyZCUyMFNlbS9XZWJzaXRlL0FxdWFjdWx0dXJlX1Rvb2wvYXF1YWN1bHR1cmUtdG9vbHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBiYXNlOiAnLi8nLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGhtcjoge1xuICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICB9LFxuICAgIG9wZW46IHRydWUsIC8vIFRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5IG9wZW4gdGhlIGJyb3dzZXJcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6ICcvc3JjJyxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAnQGVtb3Rpb24vcmVhY3QnLFxuICAgICAgJ0BlbW90aW9uL3N0eWxlZCcsXG4gICAgICAnQG11aS9tYXRlcmlhbCcsXG4gICAgICAnQG11aS9pY29ucy1tYXRlcmlhbCdcbiAgICBdLFxuICAgIGZvcmNlOiB0cnVlXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIG11aTogWydAbXVpL21hdGVyaWFsJywgJ0BtdWkvaWNvbnMtbWF0ZXJpYWwnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtZLFNBQVMsb0JBQW9CO0FBQy9aLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLEVBQ04sUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsVUFBVTtBQUFBLE1BQ1YsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLE1BQU07QUFBQTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxpQkFBaUI7QUFBQSxNQUNmLHlCQUF5QjtBQUFBLElBQzNCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ2pELEtBQUssQ0FBQyxpQkFBaUIscUJBQXFCO0FBQUEsUUFDOUM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
