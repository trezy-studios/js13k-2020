import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import { terser } from 'rollup-plugin-terser'
import closureCompile from 'rollup-plugin-closure-compile'
import dev from 'rollup-plugin-dev'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import notify from 'rollup-plugin-notify'
import progress from 'rollup-plugin-progress'
import visualizer from 'rollup-plugin-visualizer'
import gzip from 'rollup-plugin-gzip'





export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/0.js',
        format: 'iife',
        plugins: [
          closureCompile(),
          terser(),
          htmlTemplate({
            template: 'src/index.html',
            target: 'index.html',
          }),
          gzip(),
        ],
      },
    ],
    plugins: [
      dev({
        dirs: [
          'dist',
        ],
      }),
      progress(),
      sizeSnapshot(),
      visualizer({
        filename: 'dist/stats.html',
        template: 'sunburst',
      }),
      notify(),
    ],
  },
]
