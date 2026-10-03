//@ts-check

const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../..'),
  poweredByHeader: false,
  transpilePackages: [
    '@journeys/auth-client',
    '@journeys/intake-feature',
    '@journeys/planning-feature',
    '@journeys/shared-api-client',
    '@journeys/ui-components',
  ],
};

module.exports = nextConfig;
