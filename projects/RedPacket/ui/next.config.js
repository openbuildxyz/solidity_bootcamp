/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true, // 可以设置为 false，以进行临时重定向
      },
    ];
  },
  // Can be safely removed in newer versions of Next.js
  future: {
    // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
    webpack5: true,
  },

  webpack(config) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false, // the solution
      net: false,
      tls: false,
    };

    return config;
  },
  typescript: {
    // 注意: 仅在确定你知道自己在做什么时开启此选项 
    ignoreBuildErrors: true,
  },
  eslint: {
    // 忽略在构建时的ESLint错误
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
