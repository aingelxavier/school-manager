import { build as viteBuild } from "vite";
import { rm } from "fs/promises";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function buildForVercel() {
  await rm(path.resolve(rootDir, "dist"), { recursive: true, force: true });

  console.log("Building client for Vercel...");
  
  await viteBuild({
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "client", "src"),
        "@shared": path.resolve(rootDir, "shared"),
        "@assets": path.resolve(rootDir, "attached_assets"),
      },
    },
    root: path.resolve(rootDir, "client"),
    build: {
      outDir: path.resolve(rootDir, "dist/public"),
      emptyOutDir: true,
    },
  });

  console.log("✅ Build complete!");
}

buildForVercel().catch((err) => {
  console.error(err);
  process.exit(1);
});
