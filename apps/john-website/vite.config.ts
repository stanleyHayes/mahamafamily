import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "John Dramani Mahama — Statesman",
        short_name: "John Mahama",
        description: "Statesman and Former President of Ghana",
        theme_color: "#0B4F2C",
        background_color: "#FBF8F1",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,ico,png,jpg,webp}"],
        runtimeCaching: [
          { urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i, handler: "CacheFirst", options: { cacheName: "google-fonts", expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 } } },
          { urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i, handler: "StaleWhileRevalidate", options: { cacheName: "wikimedia-images" } },
          { urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i, handler: "StaleWhileRevalidate", options: { cacheName: "cloudinary-media" } },
          { urlPattern: /\/api\/public\/.*/i, handler: "NetworkFirst", options: { cacheName: "api-public", networkTimeoutSeconds: 4 } },
        ],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  server: { port: 5175, host: true },
  preview: { port: 4175, host: true },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          query: ["@tanstack/react-query"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
