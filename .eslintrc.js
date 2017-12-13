module.exports = {
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "es6": true,
        "mocha": true,
        "node": true
    },
    "rules": {
        "eol-last": ["error", "always"],
        "no-trailing-spaces": "error",
        "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
        "semi": "error"
    }
};
