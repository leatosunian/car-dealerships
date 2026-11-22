/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    experimental: {
        // Cuando corremos npm run dev, Next avisa si la version instalada tiene
        // una vulnerabilidad publicada y ofrece subir al parche que la arregla.
        // Con "security" solo propone esos parches de seguridad, no cualquier version nueva.
        agentUpgrade: 'security',
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
          },
        ],
      },
};

export default nextConfig;
