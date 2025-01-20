import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['antd'],
  sassOptions: {
    implementation: 'sass-embedded',
  },
};

export default nextConfig;
