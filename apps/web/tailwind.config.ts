import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
    content: [
        "./app/**/*.{ts,jsx,tsx,mdx}",
        "./pages/**/*.{ts,jsx,tsx,mdx}",
        "./components/**/*.{ts,jsx,tsx,mdx}",
    ],
    presets: [sharedConfig],
};

export default config;