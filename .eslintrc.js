module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "env": {
      "browser": true,
      "node": true,
      "mocha": true
    },
    "rules": {
        "brace-style": ["error", "allman"],
        "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
        "no-underscore-dangle": ["error", { "allowAfterThis": true }],
        "radix": ["error", "as-needed"],
        "valid-typeof": ["error", { "requireStringLiterals": false }],
        "no-underscore-dangle": ["error", { "allow": ["_errors", "_scheme"]}],
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
