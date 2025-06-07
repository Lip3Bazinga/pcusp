export const config = {
  // URLs do servidor
  SERVER_URI: process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8000/api/v1",

  // OAuth Credentials
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",

  // JWT Secret
  SECRET: process.env.SECRET || "",

  // VdoCipher para vídeos
  VDOCIPHER_API_SECRET: process.env.VDOCIPHER_API_SECRET || "",

  // Configurações do backend (do .env anterior)
  PORT: process.env.PORT || 8000,
  ORIGIN: process.env.ORIGIN || ["http://localhost:3000"],
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || "",

  // Cloudinary
  CLOUD_NAME: process.env.CLOUD_NAME || "",
  CLOUD_API_KEY: process.env.CLOUD_API_KEY || "",
  CLOUD_SECRET_KEY: process.env.CLOUD_SECRET_KEY || "",

  // Redis/Upstash
  REDIS_URL: process.env.REDIS_URL || "",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",

  // JWT Tokens
  ACTIVATION_SECRET: process.env.ACTIVATION_SECRET || "",
  ACCESS_TOKEN: process.env.ACCESS_TOKEN || "",
  REFRESH_TOKEN: process.env.REFRESH_TOKEN || "",
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || "5",
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || "3",

  // SMTP
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || "465",
  SMTP_SERVICE: process.env.SMTP_SERVICE || "",
  SMTP_MAIL: process.env.SMTP_MAIL || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
}
