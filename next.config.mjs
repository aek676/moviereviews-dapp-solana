/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      child_process: false,
      readline: false,
      "stream/promises": false,
    };
    return config;
  },
};

export default nextConfig;
