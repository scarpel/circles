/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVER_BACKEND_URL: process.env.SERVER_BACKEND_URL,
    CLIENT_BACKEND_URL: process.env.CLIENT_BACKEND_URL,
  },
};

module.exports = nextConfig;
