/**
 * Requires
 */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

const join = path.join;


/**
 * Variables
 */
const PATHS = {
  src: join(__dirname, 'src'),
  dist: join(__dirname, '../docs'),
};

 /**
  * Common Configuration
  */
const Common = {
  context: PATHS.src,
  entry: [
    'core-js/fn/promise',
    'core-js/fn/object',
    'core-js/fn/array',
    './index.jsx',
  ],
  output: {
    filename: 'app.js',
    path: PATHS.dist,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: [/node_modules\/(?!@1studio)/],
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
  ],
};


module.exports = (env) =>
{
  /**
   * Production
   */
  if (env.prod)
  {
    return {
      ...Common,
      module:
      {
        rules: [
          ...Common.module.rules,
          {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    minimize: true,
                    importLoaders: true,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: (loader) => [
                      require('postcss-inline-svg'),
                      require('autoprefixer'),
                    ]
                  },
                },
                'sass-loader',
              ],
              fallback: 'style-loader',
            }),
          },
        ],
      },
      plugins:
      [
        ...Common.plugins,
      ],
    };
  }

  /**
   * Development
   */
  return {
    ...Common,
    module:
    {
      rules: [
        ...Common.module.rules,
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options:
              {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('postcss-inline-svg')
                ],
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options:
              {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    devtool: 'eval',
    devServer: {
      contentBase: PATHS.dist,
      compress: true,
      port: 9009,
      hot: true,
      historyApiFallback: true,
    },
    plugins: [
      ...Common.plugins,
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
