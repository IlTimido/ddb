import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended, // Regole base per evitare errori logici
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jquery,
        Phaser: "readonly", // Evita errori su Phaser globale
      },
    },
    rules: {
      // Qui mettiamo a morte le regole che odiavi di Airbnb
      "no-console": "warn", // Solo un avviso, non blocca tutto [cite: 8]
      "no-unused-vars": "warn", // Solo un avviso, non blocca tutto [cite: 7]
      "no-debugger": "off", // Puoi usarlo liberamente [cite: 9]
      quotes: "off", // Usa '' o "" come ti pare
      semi: ["warn", "always"], // Solo un consiglio per le passate
      "no-plusplus": "off", // x++ è sacrosanto [cite: 2]
      "linebreak-style": "off", // Windows o Linux, chi se ne frega [cite: 2]
      camelcase: "off", // Usa l'underscore se vuoi [cite: 15]
      "prefer-template": "off", // Usa il + per concatenare se preferisci [cite: 11]
      "max-len": "off", // Righe lunghe quanto vuoi [cite: 6]
      "no-undef": "error", // Questo è l'unico che serve davvero
      "no-case-declarations": "off", // Permetti dichiarazioni in switch case [cite: 4]
    },
  },
];
