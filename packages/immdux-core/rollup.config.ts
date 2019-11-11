// @ts-ignore
import resolve from 'rollup-plugin-node-resolve';
// @ts-ignore
import commonjs from 'rollup-plugin-commonjs';
// @ts-ignore
import sourceMaps from 'rollup-plugin-sourcemaps';
// @ts-ignore
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';
// @ts-ignore
import filesize from 'rollup-plugin-filesize';
// @ts-ignore
import { terser } from 'rollup-plugin-terser';
// @ts-ignore
import camelCase from 'lodash.camelcase';

const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      name: camelCase(pkg.name),
      format: 'umd',
      sourcemap: true,
      globals: {
        immutable: 'Immutable',
        rxjs: 'Rx',
      },
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash').
  external: ['immutable', 'rxjs', 'rxjs/operators'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution.
    json(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs).
    resolve(),
    commonjs(),
    // Compile TypeScript files.
    typescript({
      clean: true,
      useTsconfigDeclarationDir: false,
      tsconfigOverride: {
        exclude: ['src/**/__tests__/*.test.ts'],
      },
    }),
    // Uglify build output.
    terser({ toplevel: true }),
    // Resolve source maps to the original source.
    sourceMaps(),
    // Shows minified and gziped file size.
    filesize(),
  ],
};
