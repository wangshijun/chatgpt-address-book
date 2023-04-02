module.exports = function override(config, env) {
  // Add fallbacks for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
  };

  return config;
};
