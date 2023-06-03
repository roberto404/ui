const path  = require('path');

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/.stories/**/*.stories.@(js|jsx|ts|tsx)"],
  // Essential addons: docs, controls, actions, viewport, background, toolbar, measure
  addons: ["@storybook/addon-essentials", "addon-redux"],
  // core: {
  //   builder: 'webpack5',
  // },
  webpackFinal: async config => {
    // console.log(config.module.rules);
    // remove exclude option:
    // exclude: /node_modules/
    delete config.module.rules[2].exclude;

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options:
          {
            sourceMap: true,
            url: {
              filter: (url) =>
              {
                if (/(png|jpg|woff|ttf)$/.test(url)) {
                  return false;
                }

                return true;
              }
            }
          },
        },
        'sass-loader'
      ],
      // include: path.resolve(__dirname, '../'),
    });

    config.resolve.alias['@1studio/ui'] = path.join(__dirname, '../src');


    // {
    //   test: /\.(scss|css)$/,
    //   use: [
    //     'style-loader',
    //     'css-loader',
    //     'sass-loader',
    //   ],
    // },

    return config;
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  docs: {
    autodocs: true,
    // source: { type: 'code' },  // forces the raw source code (rather than the rendered JSX).
  },
  // typescript: {
  //   reactDocgen: 'react-docgen-typescript',
  // }
};