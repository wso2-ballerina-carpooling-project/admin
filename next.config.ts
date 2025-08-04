import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the rewrites function here
  async rewrites() {
    return [
      {
        // This is the path your frontend will request
        source: "/api/:path*",

        // This is the actual destination where the request will be sent (your Ballerina backend)
        destination: "http://localhost:9090/api/:path*",
      },
    ];
  },

  /* other config options you might have can go here */
};

export default nextConfig;
