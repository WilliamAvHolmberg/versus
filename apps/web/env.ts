export const env = {
  ELKS_API_USERNAME: process.env.ELKS_API_USERNAME!,
  ELKS_API_PASSWORD: process.env.ELKS_API_PASSWORD!,
} as const

// Type check to ensure all env vars are defined
Object.entries(env).forEach(([key, value]) => {
  if (!value) throw new Error(`Missing environment variable: ${key}`)
}) 