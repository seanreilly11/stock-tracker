/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.polygon.io",
                port: "",
                pathname: "/v1/reference/company-branding/**",
            },
        ],
    },
};

export default nextConfig;
