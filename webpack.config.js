const ClosureCompilerPlugin = require('webpack-closure-compiler')
const CopyWebpackPlugin = require('copy-webpack-plugin')
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
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},

	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},

			{
				test: /\.s?css$/,
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
			// new ClosureCompilerPlugin,
			new TerserPlugin,
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
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'src/assets',
					to: 'assets',
				},
			],
		}),
	],
}
