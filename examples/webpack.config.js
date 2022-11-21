const path  = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');

const HtmlWebpackPlugin = require('html-webpack-plugin');


const yaml = require('js-yaml');
const fs = require('fs');

// const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));


const PATHS = {
  app: path.join(__dirname, 'src'),
  dist: path.join(__dirname, '../docs'),
  src: path.join(__dirname, '../src'),
};


/**
 * Common Configuration
 */
const Common = {
  context: PATHS.app,
  entry: [
    './index.jsx',
  ],
  output: {
    path: PATHS.dist,
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        use: 'babel-loader',
        // include: [
        //   PATHS.app,
        //   PATHS.src,
        //   path.join(__dirname, '../node_modules/@1studio/'),
        // ],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-inline-svg",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
            // options: {
            //   plugins: (loader) => [
            //     require('postcss-inline-svg')
            //   ],
            //   sourceMap: true,
            // },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins:
  [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new (class {
      apply(compiler) {
        compiler.hooks.done.tap('Remove LICENSE', () => {
          rimraf.sync(PATHS.dist + '/*.LICENSE.txt');
        });
      }
    })(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'src': PATHS.src,
    //   '@1studio/kontakt2': PATHS.kontakt2,
    //   '@1studio/3d': PATHS['3D'],
    //   '@1studio/components': PATHS.shared,
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer')
    },
  },
};

module.exports = (env) =>
{
  if (env.production)
  {
    return {
      ...Common,
    };
  }

  return {
    ...Common,
    devtool: 'eval', // 'source-map',
    devServer:
    {
      static: 
      {
        directory: Common.output.path,
      },
      compress: true,
      hot: true,
      liveReload: true,
      allowedHosts: [
        'butor.rs.loc',
      ],
      port: 9009,
      historyApiFallback: true,
      proxy: {
        '/api': 'http://butor.rs.loc:80',
        '/library': 'http://butor.rs.loc:80'
      },
      open: {
        target: ['http://butor.rs.loc:9009'],
        app: {
          name: 'google chrome'
        },
      },
    },
    plugins: [
      ...Common.plugins,
      new webpack.HotModuleReplacementPlugin(),
    ]
  };
};
 