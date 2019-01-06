
const webpack = require('webpack');
const path = require('path');

const config = require('./webpack.config');

module.exports = {
  mode: 'development',

  entry: Object.assign({}, config.entry, {
    'hot-bootstrap': [
      'react-hot-loader/patch',
    ],
  }),

  output: {
    chunkFilename: '[id].bundle.js',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './_output'),
    publicPath: path.resolve(__dirname, '/'),
    libraryTarget: 'umd',
  },

  target: config.target,
  devtool: 'eval-source-map',
  resolve: config.resolve,
  resolveLoader: config.resolveLoader,

  devServer: {
    contentBase: path.join(__dirname, '_output'),
    hot: true,
    inline: false,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    watchOptions: {
      poll: true
    },
  },

  module: config.module,
  plugins: config.plugins,
  optimization: config.optimization,
};

