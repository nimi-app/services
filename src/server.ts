import CatboxMemory from '@hapi/catbox-memory';
import AuthBearer from 'hapi-auth-bearer-token';
import { Server } from '@hapi/hapi';
import Joi from 'joi';

import {
  JSON_WEB_TOKEN_SECRET,
  SERVER_HOST,
  SERVER_PORT,
} from './modules/config/config.service';
import { AuthRoutesPlugin } from './modules/routes';
import { JsonWebTokenService } from './modules/shared/services';

export const DEFAULT_AUTH_STRATEGY = 'bearer';

/**
 * Creates a new Hapi Auth Server with the following config
 * - port = `SERVER_PORT` and host `SERVER_HOST`
 * - Cache engine set to `CatboxMemory`
 * - All routes support CORS and not authentication required
 * @returns Server
 */
export function create(): Server {
  return new Server({
    port: SERVER_PORT,
    host: SERVER_HOST,
    cache: {
      engine: new CatboxMemory(),
      name: 'memory',
    },
    routes: {
      auth: false,
      cors: {
        origin: ['*'],
      },
    },
  });
}

/**
 * Configures the server object
 * - Adds Joi as default validation engine
 * - Sets rate limit in production
 * - Register router
 */
export async function configure(server: Server): Promise<Server> {
  // Register Joi
  await server.validator(Joi);
  // Rate-limit in production
  if (process.env.NODE_ENV === 'production') {
    await server.register({
      plugin: require('hapi-rate-limit'),
      options: {
        userLimit: 60000,
      },
    });
  }
  // Register and configure the auth strategy
  await server.register(AuthBearer);
  // setup Auth strategy
  server.auth.strategy(DEFAULT_AUTH_STRATEGY, 'bearer-access-token', {
    async validate(_req: Request, token: string) {
      const jwtService = new JsonWebTokenService(JSON_WEB_TOKEN_SECRET);

      // Return value is an object of these
      const artifacts = {};
      let isValid = true;
      let credentials;
      let error: Error | undefined;

      try {
        credentials = await jwtService.verify<unknown>(token);
      } catch (authError) {
        console.log(authError);
        error = authError;
        isValid = false;
      }

      return {
        isValid,
        artifacts,
        credentials,
        error,
      };
    },
  });
  // Set default auth strategy to bearer
  server.auth.default({
    mode: 'optional',
    strategies: [DEFAULT_AUTH_STRATEGY],
  });

  // Register routes
  await server.register(AuthRoutesPlugin);
  // Return configured server
  return server;
}

/**
 * Starts a new created server with default config
 * @returns the started `Server` object
 */
export async function start() {
  const server = await configure(create());
  await server.start();
  return server;
}

