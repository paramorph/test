
const webpack = require('webpack');
const path = require('path');

const config = require('./webpack.config');

module.exports = {
  mode: 'development',

  entry: Object.assign({}, config.entry, {
    'hot-bootstrap': [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
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
  externals: config.externals,

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    watchOptions: {
      poll: true
    },
  },

  module: {
    noParse: config.module.noParse,
    rules: config.module.rules,
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ].concat(
    config.plugins
  )
};

