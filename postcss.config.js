const webpackPostcssTools = require('webpack-postcss-tools');

const map = webpackPostcssTools.makeVarMap('./src/styles/colors.css');

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-custom-properties')({ variables: map.vars }),
    require('postcss-cssnext')(),
  ],
};
