import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Allow LAN IP access in `next dev` (CSS/JS are otherwise 403).
  allowedDevOrigins: ["192.168.1.145"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/ops-login",
        destination: "/command-center",
        permanent: false,
      },
      {
        source: "/services/ocean-nvocc",
        destination: "/services/nvocc",
        permanent: true,
      },
      {
        source: "/services/customs",
        destination: "/services/customs-clearance",
        permanent: true,
      },
      {
        source: "/services/door-to-door",
        destination: "/services/door-to-door-logistics",
        permanent: true,
      },
      {
        source: "/services/exim-advisory",
        destination: "/services/exim-consultancy",
        permanent: true,
      },
      {
        source: "/locations/mundra-port",
        destination: "/locations/mundra",
        permanent: true,
      },
      {
        source: "/locations/chennai-port",
        destination: "/locations/chennai",
        permanent: true,
      },
      {
        source: "/locations/kolkata-port",
        destination: "/locations/kolkata",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
