export default [
  {
    ignores: ["node_modules/**", "public/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        __dirname: "readonly",
        process: "readonly",
        console: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        beforeEach: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
        Buffer: "readonly",
      },
    },
  },
];
