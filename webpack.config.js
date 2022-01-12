const webpack               = require('webpack');
const path                  = require('path');
const htmlWebpackPlugin     = require('html-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const Dotenv                = require('dotenv-webpack');
const BUILD_DIR             = path.join(__dirname, 'dist');
const APP_DIR               = path.join(__dirname, 'src');


// Files to be rendered into a separate file (speed improve)
const VENDOR_LIBS = [
	'react','react-dom'
]

var config = {
	
	entry: {
		bundle: APP_DIR + '/index.js',
		vendor: VENDOR_LIBS
	},
	output: {
		path: path.resolve(__dirname, 'dist'), // If you need to serve content from multiple directories -> [BUILD_DIR, path.join(__dirname, 'assets')];
		filename: '[name].[hash].js'      // Assign default names + random number (hash)
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				//include: APP_DIR,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: ['style-loader','css-loader']
			}, 
			{
				test:/\.scss$/,
				use: ['style-loader','css-loader','sass-loader']
			},
			{
		        test: /\.(png|jpe?g|gif)$/i,
		        use: [
		          {
		            loader: 'file-loader',
		            options: {
		              name: 'images/[contenthash].[ext]',
		            },
		          },
		        ],
		      },
			  {
				test: /\.(glb|gltf)$/,
				use:
				[
					{
						loader: 'file-loader',
						options:
						{
							outputPath: 'assets/models/'
						}
					}
				]
            },
		]
	},
	devServer: {
		contentBase: BUILD_DIR, // Default was BUILD_DIR; If using webpack use this.
		historyApiFallback: true, // For router
		compress: true,
		port: 3000,
		disableHostCheck: false, // Always false
     /* headers: {
			"X-Custom-header": "custom" // If you have app with auth that requires specific headers
		},*/
		open: true, // When server starts, open server in browser
		hot: true  // Enable hot module replacement plugin
	},
	plugins: [
		new htmlWebpackPlugin({
			template: 'index.html', // Create on every build an 'index.html' inside dist folder
			//  favicon: 'src/images/logotr.png'
		}),
		new webpack.HotModuleReplacementPlugin(), // See changes faster without refresh. No full refresh.
		new webpack.DefinePlugin({
	       'process.env.NODE_ENV': JSON.stringify('production')
	    }),
	    new Dotenv()
	],
	// splitChunks checks for common files between bundle and vendor files
	  // 'Splits' files into smaller pieces for greater optimization
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
	 performance: {
	    hints: false,
	    maxEntrypointSize: 512000,
	    maxAssetSize: 512000
	}
}

module.exports = config;