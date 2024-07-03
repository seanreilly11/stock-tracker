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
            {
                protocol: "https",
                hostname: "g.foolcdn.com",
                port: "",
                pathname: "/editorial/images/**",
            },
            {
                protocol: "https",
                hostname: "static.seekingalpha.com",
                port: "",
                pathname: "/cdn/s3/uploads/**",
            },
            {
                protocol: "https",
                hostname: "cdn.benzinga.com",
                port: "",
                pathname: "/files/**",
            },
        ],
    },
};

export default nextConfig;
