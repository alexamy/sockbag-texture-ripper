// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:solid/typescript",
  ],
  plugins: ["@typescript-eslint", "solid", "import"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "src",
            from: "stories",
            message: "Stories can not be imported by the app.",
          },
        ],
      },
    ],
  },
};
