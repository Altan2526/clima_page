/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
};

export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
