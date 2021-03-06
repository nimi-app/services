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

/**
 *
 */
export const JSON_WEB_TOKEN_SECRET = process.env
  .JSON_WEB_TOKEN_SECRET as string;

/**
 * Nimi Connect Signature Text Payload
 * This is the text that is used to sign and verify signatures.
 */
export const NIMI_CONNECT_SIGNATURE_TEXT_PAYLOAD =
  process.env.NIMI_CONNECT_SIGNATURE_TEXT_PAYLOAD || 'Nimi Connect';

/**
 * Web3 Storage access token
 */
export const WEB3_STORAGE_ACCESS_TOKEN = process.env
  .WEB3_STORAGE_ACCESS_TOKEN as string;

