import type { NextConfig } from "next";

// No special config is needed for the embedded integration: Coras mounts on the
// client, into one route sub-tree, so there is nothing to wire up at the
// framework level. This file exists only to make the app a typed Next project.
const nextConfig: NextConfig = {};

export default nextConfig;
