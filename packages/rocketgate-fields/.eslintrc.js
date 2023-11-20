module.exports = {
  extends: ["custom/react"],
  overrides: [
    {
      files: ["*.tsx"],
      rules: { "no-console": "off" },
    },
  ],
};
