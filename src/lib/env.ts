import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(['development', 'production']),
        CLERK_SECRET_KEY: z.string().min(1),
        TMDB_BEARER: z.string().min(1),
        DATABASE_URL: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    },
})

export const IS_DEV = env.NODE_ENV === "development";
export const IS_PROD = env.NODE_ENV === "production";