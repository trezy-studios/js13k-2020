import { generateHTML } from './rollup-plugins/generateHTML'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import { terser } from 'rollup-plugin-terser'
import closureCompile from 'rollup-plugin-closure-compile'
import postcss from 'rollup-plugin-postcss'
import dev from 'rollup-plugin-dev'
import notify from 'rollup-plugin-notify'
import progress from 'rollup-plugin-progress'
import visualizer from 'rollup-plugin-visualizer'





export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'iife',
        plugins: [],
      },
      {
        file: 'dist/0.js',
        format: 'iife',
        plugins: [
          closureCompile(),
          terser(),
        ],
      },
    ],
    plugins: [
			postcss({
				extract: true,
				minimize: true,
			}),
			generateHTML({
				minify: true,
				target: '{bundle}.html',
				template: 'src/index.html',
			}),
      dev({
        dirs: [
          'dist',
        ],
      }),
      progress(),
      sizeSnapshot(),
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        template: 'sunburst',
      }),
      notify(),
    ],
  },
]
