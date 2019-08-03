
const path = require('path');
const webpack = require('webpack');

const IsomorphicHtmlPlugin = require('isomorphic-html-webpack-plugin').default;

module.exports = {
	entry: {
    client: [
      'paramorph/entry/client',
    ],
    server: [
      'paramorph/entry/server',
    ],
  },

  output: {
    chunkFilename: '[id]-[contenthash].bundle.js',
    filename: '[name]-[hash].bundle.js',
    path: path.resolve(__dirname, './_output'),
    publicPath: '/',
    libraryTarget: 'umd',
  },

  mode: 'development',
  target: 'web',
  devtool: 'source-map',

  resolve: {
    extensions: [
      '.js', '.tsx', '.ts', '.css', '.markdown', '.yml'
    ],
    alias: {
      '@website': path.resolve(__dirname),
    },
  },

  resolveLoader: {
    alias: {
      'config-loader': 'paramorph/loader/config',
      'markdown-loader': 'paramorph/loader/markdown',
    },
  },

  module: {
    rules: [
      {
        test: path.resolve(__dirname, './_config.yml'),
        loader: 'config-loader',
        options: {
          policy: {
            missingDescription: 'warning',
          },
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader',
      },
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
        ],
      },
      {
        test: /\.markdown$/,
        use: [
          'markdown-loader',
        ],
      },
    ],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new IsomorphicHtmlPlugin({
      entry: 'server',

      locals: {
        title: 'Paramorph',
      },
    }),
  ],

	optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 1,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

