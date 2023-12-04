/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  },
};

module.exports = nextConfig;
