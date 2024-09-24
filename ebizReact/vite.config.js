import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//console.log(path.resolve(__dirname, "./src"))
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    //alias: [{ find: "@", replacement: path.resolve(__dirname, "./src/") }]
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "./src/api/"),
      "@assets": path.resolve(__dirname, "./src/assets/"),
      "@components": path.resolve(__dirname, "./src/components/"),
      "@configuration": path.resolve(__dirname, "./src/configuration/"),
      "@constants": path.resolve(__dirname, "./src/constants/"),
      "@context": path.resolve(__dirname, "./src/context/"),
      "@css": path.resolve(__dirname, "./src/css/"),
      "@hooks": path.resolve(__dirname, "./src/hooks/"),
      "@pages": path.resolve(__dirname, "./src/pages/"),
      "@routes": path.resolve(__dirname, "./src/routes/"),
      "@store": path.resolve(__dirname, "./src/store/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@validations": path.resolve(__dirname, "./src/validations/")
    }
  },
  server: {
    port: 3000
  }
});
