const path = require('path');
const webpack = require('webpack');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

//Path for the bundle:
const BUILD_DIR = path.resolve(__dirname,'client/dist');
//Path for all jsx files:
const APP_DIR = path.resolve(__dirname,'client/src/app');

module.exports = {
  devtool: 'source-map',
  entry: APP_DIR + '/app.js',
  output: {
    path: BUILD_DIR,
    filename: 'app.js',
    publicPath: BUILD_DIR
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new TransferWebpackPlugin([
      {from: 'www'},
    ], path.resolve(__dirname, 'client/src')),
  ],
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      include: APP_DIR,
      exclude: APP_DIR + '/node_modules/',
      query: {
        presets: ['es2015', 'react', 'stage-2']
      }
    },{
      test: /\.ico$/,
      loader: 'file-loader?name=[name].[ext]'
    }]
  },
};
