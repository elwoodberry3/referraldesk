/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: This build intentionally does NOT use `output: 'export'`.
  // ReferralDesk requires live server routes (referral intake, n8n
  // webhook, HubSpot write, SMS confirmation). Static export would
  // disable all API routes. Standard Vercel serverless deploy.
  reactStrictMode: true,
};

export default nextConfig;
