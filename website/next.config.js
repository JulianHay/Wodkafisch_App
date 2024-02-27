/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.wodkafis.ch',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'play.google.com',
        port: '',
        pathname: '/intl/en_us/badges/static/images/badges/**',
      },
    ],
  },
}

module.exports = nextConfig
