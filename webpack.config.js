/**
 * Requires
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');
const join = path.join;

const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));


/**
 * Variables
 */
const PATHS = {
  src: join(__dirname, 'examples'),
  dist: join(__dirname, 'build'),
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
    './build.jsx',
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
      {
        test: /\.pug$/,
        use: 'pug-loader',
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
        new HtmlWebpackPlugin({
          inject: false,
          template: '../assets/html/index.pug',
          templateConfig: config,
        }),
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
      port: 9002,
      hot: true,
      historyApiFallback: true,
    },
    plugins: [
      ...Common.plugins,
      new HtmlWebpackPlugin({
        inject: 'body',
        template: '../assets/html/index.pug',
        templateConfig: config,
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
