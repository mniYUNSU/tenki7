/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org'
      }
    ]
  },
  i18n
  //   trailingSlash: true,
  //   localePath: path.resolve('./public/locales')
};

// export default nextConfig;
