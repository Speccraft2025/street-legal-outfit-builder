const nextConfig = {
  output: 'standalone',
  // Allows Turborepo to map the standalone output correctly
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
};

module.exports = nextConfig;
