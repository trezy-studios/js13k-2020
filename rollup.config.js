import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import { terser } from 'rollup-plugin-terser'
import closureCompile from 'rollup-plugin-closure-compile'
import notify from 'rollup-plugin-notify'
import progress from 'rollup-plugin-progress'
import visualizer from 'rollup-plugin-visualizer'





export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: '0.js',
        format: 'cjs',
      },
      {
        file: 'builds/terser.js',
        format: 'cjs',
        plugins: [
          terser(),
        ],
      },
      {
        file: 'builds/closure.js',
        format: 'cjs',
        plugins: [
          closureCompile(),
        ],
      },
      {
        file: 'builds/closure-terser.js',
        format: 'cjs',
        plugins: [
          closureCompile(),
          terser(),
        ],
      },
      {
        file: 'builds/terser-closure.js',
        format: 'cjs',
        plugins: [
          terser(),
          closureCompile(),
        ],
      },
      {
        file: 'builds/closure-terser-closure.js',
        format: 'cjs',
        plugins: [
          closureCompile(),
          terser(),
          closureCompile(),
        ],
      },
      {
        file: 'builds/terser-closure-terser.js',
        format: 'cjs',
        plugins: [
          terser(),
          closureCompile(),
          terser(),
        ],
      },
    ],
    plugins: [
      progress(),
      sizeSnapshot(),
      visualizer(),
      notify(),
    ],
  },
]
