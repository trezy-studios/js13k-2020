import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import { terser } from 'rollup-plugin-terser'
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
        plugins: [
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
