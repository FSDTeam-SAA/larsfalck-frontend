/** @type {import('next').NextConfig} */
const nextConfig = {
  
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "larsfalck-media.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
