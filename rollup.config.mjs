import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/calculator-card.ts",
  output: {
    file: "dist/calculator-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    production && terser(),
    !production &&
      serve({
        open: true,
        openPage: "/dev/",
        contentBase: ["dist", "dev", "."],
        host: "localhost",
        port: 5000,
      }),
    !production && livereload({ watch: "dist" }),
  ],
};
