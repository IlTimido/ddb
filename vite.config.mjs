import { defineConfig } from "vite";
import path from "path";
import eslint from "vite-plugin-eslint";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    base: "./",

    // Configurazione del minificatore
    esbuild: {
      // 'drop' rimuove fisicamente le chiamate dal codice
      // Lo attiviamo SOLO se siamo in produzione
      drop: isProduction ? ["console", "debugger"] : [],
    },

    resolve: {
      alias: {
        assets: path.resolve(__dirname, "./src/assets"),
        fonts: path.resolve(__dirname, "./src/fonts"),
      },
    },

    build: {
      outDir: "dist",
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: "js/app.bundle.js",
          chunkFileNames: "js/[name].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith(".css")) return "css/styles.css";
            return "assets/[name][ext]";
          },
        },
      },
    },

    server: {
      port: 8080,
      hot: true,
    },

    plugins: [
      eslint({
        cache: false, // Ti consiglio false per i test, poi puoi metterlo true
        include: ["./src/**/*.js"],
        // Impedisce al plugin di bloccarsi se trova avvisi (non errori)
        failOnWarning: false,
        failOnError: isProduction, // Blocca la build solo se sei in produzione e ci sono errori
      }),
    ],
  };
});
