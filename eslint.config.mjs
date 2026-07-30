import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Código vendorizado de Animate UI (`shadcn add @animate-ui/icons-*`).
    // Está en beta y upstream pide actualizarlo seguido, así que lo dejamos
    // igual al original en vez de parchearlo: cualquier fix nuestro se perdería
    // en la próxima actualización. Estas tres reglas son del React Compiler y
    // las viola el wrapper, no nuestro código.
    files: ["components/animate-ui/**/*.tsx", "hooks/use-is-in-view.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/static-components": "off",
    },
  },
]);

export default eslintConfig;
