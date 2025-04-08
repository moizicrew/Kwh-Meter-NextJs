/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MQTT_BROKER_URL: process.env.NEXT_PUBLIC_MQTT_BROKER_URL,
  },
};

export default nextConfig;
