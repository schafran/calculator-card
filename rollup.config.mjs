import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: "src/calculator-card.ts",
  output: {
    file: "dist/calculator-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [resolve(), commonjs(), typescript(), json(), terser()],
};
