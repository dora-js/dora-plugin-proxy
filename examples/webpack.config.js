module.exports = function(webpackConfig) {
  webpackConfig.externals = {
     jquery: "jQuery",
  };
  return webpackConfig;
};
