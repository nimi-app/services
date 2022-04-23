import CatboxMemory from '@hapi/catbox-memory';
import { Server } from '@hapi/hapi';
import Joi from 'joi';

import { SERVER_HOST, SERVER_PORT } from './modules/config/config.service';
import { AuthRoutesPlugin } from './modules/routes';

export const DEFAULT_AUTH_STRATEGY = 'bearer';

/**
 * Creates a new Hapi Auth Server with the following config
 * - port = `AUTH_SERVER_PORT` and host `AUTH_SERVER_HOST`
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
        userLimit: 60,
      },
    });
  }

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

