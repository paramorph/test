
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

  output: config.output,
  target: config.target,
  devtool: 'eval-source-map',
  resolve: config.resolve,
  resolveLoader: config.resolveLoader,

  devServer: {
    contentBase: path.join(__dirname, '/'),
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

