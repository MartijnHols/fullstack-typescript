const { override, addBabelPreset, disableEsLint } = require('customize-cra')

module.exports = override(
  addBabelPreset([
    '@emotion/babel-preset-css-prop',
    {
      sourceMap: process.env.NODE_ENV === 'development',
    },
  ]),
  // No need to run ESLint in CI since we have a separate pipeline for this.
  // This saves some runtime.
  process.env.CI && disableEsLint(),
)
