import { config } from 'dotenv';

export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const SERVER_HOST = process.env.SERVER_HOST || 'localhost';

// Load the config
config();

/**
 * Config for Auth Server
 */
export const TWITTER_API_V2_BEARER_TOKEN = process.env
  .TWITTER_API_V2_BEARER_TOKEN as string;

/**
 * MongoDB
 */
export const MONGO_URI = process.env.MONGO_URI as string;

/**
 * Sentry Debug DSN
 */
export const SENTRY_DSN = process.env.SENTRY_DSN as string;

