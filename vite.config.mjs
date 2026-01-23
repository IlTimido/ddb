import { defineConfig } from "vite";
import path from "path";
import eslint from "vite-plugin-eslint";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    // 1. Usiamo il punto per dire "questa cartella", evitando risoluzioni assolute
    root: "./",

    base: "./",

    resolve: {
      // 2. QUESTA È LA CHIAVE: Impedisce a Vite/Node di risolvere il "realpath"
      // Forza l'uso del percorso del disco virtuale E:
      preserveSymlinks: true,

      alias: {
        assets: path.resolve(__dirname, "./src/assets"),
        fonts: path.resolve(__dirname, "./src/fonts"),
      },
    },

    // ... (restanti configurazioni: esbuild, build) ...

    server: {
      port: 8080,
      hot: true,
      fs: {
        strict: false,
        // 3. Autorizziamo esplicitamente entrambi i punti di vista
        allow: ["E:/", "C:/DiscoE/"],
      },
      host: true,
      // 4. Se il problema persiste, il watcher potrebbe confondersi
      watch: {
        usePolling: true, // Più lento ma ignora i problemi di file system virtuale
      },
    },

    plugins: [
      eslint({
        cache: false,
        include: ["./src/**/*.js"],
        failOnWarning: false,
        failOnError: isProduction,
      }),
    ],
  };
});
