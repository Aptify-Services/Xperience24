import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config({ path: ".env.production" });

export default defineConfig({
  define: {
    "process.env": {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL)
    }
  }
});
