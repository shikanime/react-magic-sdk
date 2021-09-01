import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default [
  {
    input: "src/index.ts",
    plugins: [esbuild()],
    output: [
      {
        file: "dist/react-datastudio.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/react-datastudio.mjs",
        format: "es",
        sourcemap: true,
      },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: {
      file: "dist/react-datastudio.d.ts",
      format: "es",
    },
  },
];