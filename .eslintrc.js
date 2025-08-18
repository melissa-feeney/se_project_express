module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": ["warn", { allow: ["error"] }],
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        json: "always",
      },
    ],
    "import/no-unresolved": "off", // Optional: disable if you're confident in your paths
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".json"],
      },
    },
  },
};
