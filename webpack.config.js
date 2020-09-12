const ClosurePlugin = require('closure-webpack-plugin')
const HTMLWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')




const isProduction = process.env.npm_lifecycle_event === 'build'
module.exports = {
	devServer: {
		contentBase: './dist',
		hot: true,
		overlay: true,
		stats: 'minimal',
	},

	devtool: !isProduction && 'source-map',

	entry: './src/index.js',

	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},

	module: {
		rules: [
			{
				test: /\.json$/,
				exclude: /node_modules/,
				type: 'javascript/auto',
				use: [
					'babel-loader',
					path.resolve('webpack', 'json-map-loader.js'),
				],
			},

			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},

			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCSSExtractPlugin.loader,
						options: {
							hmr: !isProduction,
						},
					},
					{ loader: 'css-loader' },
					{ loader: 'sass-loader' },
				],
			},

			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							disable: true,
						},
					},
				],
			},
		],
	},

	optimization: {
		minimize: isProduction,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: {
						booleans_as_integers: true,
						drop_console: false,
						ecma: 6,
						passes: 5,
						unsafe: true,
					},
					mangle: {
						// properties: {
						// 	builtins: false,
						// 	reserved: ['on'],
						// },
					},
				},
			}),
			new ClosurePlugin({
				mode: 'STANDARD',
			}, {
				languageOut: 'ECMASCRIPT_2020',
			}),
		],
	},

	plugins: [
		new HTMLWebpackPlugin({
			inlineSource: isProduction && '\.(js|css)$',
			minify: isProduction && {
				collapseWhitespace: true
			},
			template: 'src/index.html',
		}),
		new HTMLWebpackInlineSourcePlugin(HTMLWebpackPlugin),
		new OptimizeCSSAssetsPlugin,
		new MiniCSSExtractPlugin({
			filename: '[name].css',
		})
	],
}
