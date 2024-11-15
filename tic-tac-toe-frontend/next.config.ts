import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    SOCKET_URI: process.env.SOCKET_URI,
  },
};

export default nextConfig;
