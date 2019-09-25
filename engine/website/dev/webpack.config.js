/**
 * Requires
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { join } = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));


/**
 * Variables
 */
const PATHS = {
  src: join(__dirname, 'src'),
  dist: join(__dirname, '../../../public_html/website'),
};

 /**
  * Common Configuration
  */
const Common = {
  context: PATHS.src,
  entry: [
    'core-js/fn/promise', // 37 Kbyte
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
        // exclude: [/node_modules\/(?!@1studio)/],
        // exclude: [/node_modules\/(?!@1studio)|(superagent)/],
        // include: /(@1studio)|(superagent)/,
        // include: /(superagent)/,
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
                    ],
                  },
                },
                'sass-loader',
              ],
              fallback: 'style-loader',
            }),
          },
        ],
      },
      // devtool: 'eval',
      plugins:
      [
        ...Common.plugins,
        new HtmlWebpackPlugin({
          inject: false,
          template: '../assets/html/index.pug',
          templateConfig: config.document,
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
                  require('postcss-inline-svg'),
                  require('autoprefixer'),
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
    // devtool: 'source-map',
    devServer: {
      contentBase: PATHS.dist,
      compress: true,
      hot: true,
      // host: '10.0.1.4',
      port: 9231,
      public: 'rs.loc:9231',
      historyApiFallback: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://rs.loc:80',
        },
        {
          context: ['/library'],
          target: 'http://rs.loc:80/kontakt2',
        },
      ],
    },
    plugins: [
      ...Common.plugins,
      new HtmlWebpackPlugin({
        inject: 'body',
        template: '../assets/html/index.pug',
        templateConfig: config.document,
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
