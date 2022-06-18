import { config } from 'dotenv';

// Load the config
config();

export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';

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
 * Sentry Debug DSN: optional
 */
export const SENTRY_DSN = process.env.SENTRY_DSN;

/**
 *
 */
export const PINATA_API_KEY = process.env.PINATA_API_KEY as string;
export const PINATA_API_SECRET = process.env.PINATA_API_SECRET as string;

