/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/appointments/:path*',
            destination: 'http://localhost:4000/appointments/:path*',
          },
          {
            source: '/submit-booking',
            destination: 'http://localhost:4000/submit-booking',
          },
          {
            source: '/modify-appointment',
            destination: 'http://localhost:4000/modify-appointment',
          },
          {
            source: '/cancel-appointment',
            destination: 'http://localhost:4000/cancel-appointment',
          },
        ];
      },
};

  
export default nextConfig;
