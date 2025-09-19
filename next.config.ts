import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "zsolts-home-temp-dashboard";

const nextConfig: NextConfig = {
    output: "export",                  // generate static HTML in /out
    images: { unoptimized: true },     // next/image without loader
    trailingSlash: true,               // GH Pages serves /about/index.html nicely
    // For project pages (https://username.github.io/<repo>)
    basePath: isProd ? `/${repo}` : "",
    assetPrefix: isProd ? `/${repo}/` : "",
};

export default nextConfig;
