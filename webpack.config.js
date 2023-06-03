const path  = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');

/* !-- Constants */

const PATHS = {
  app: path.join(__dirname, 'src/.examples'),
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'docs'),
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
        test: /\.(j|t)s(x)?$/,
        use: 'babel-loader',
        include: [
          PATHS.src,
          path.join(__dirname,  './node_modules/@1studio/utils'),
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',{
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-inline-svg",
                    "autoprefixer",
                  ],
                ],
              },
            },
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
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@1studio/ui': PATHS.src,
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      // buffer: false,
      buffer: require.resolve('buffer/')
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
      port: 9019,
      historyApiFallback: true,
      proxy: {
        '/api': 'http://butor.rs.loc:80',
        '/library': 'http://butor.rs.loc:80'
      },
      open: {
        target: ['http://butor.rs.loc:9019'],
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
 