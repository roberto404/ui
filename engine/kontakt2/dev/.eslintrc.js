module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "env": {
      "browser": true,
      "node": true,
      "mocha": true
    },
    "rules": {
        "brace-style": ["error","allman"],
        "import/first": [ "warn", "DISABLE-absolute-first" ],
        "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
        "no-underscore-dangle": ["error", { "allowAfterThis": true }],
        "radix": ["error", "as-needed"],
        "valid-typeof": ["error", { "requireStringLiterals": false }],
        'no-shadow': [
          "error",
          {
            allow: [
              'flush',
              'fullscreen',
              'modal',
              'dialog',
              'preload',
              'menu',
              'popover',
              'sidebar',
              'open',
              'close',
              'hide',
              'show',
              'toggle',
              'setUser',
              'eraseUser',
              'logout',
              'modifyUserData',
            ],
          },
        ],
    },
    "plugins": [
        "babel"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": false,
            "modules": true
        }
    },
};
