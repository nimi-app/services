import { Server } from '@hapi/hapi';
import Joi from 'joi';

// Controllers
import { twitter } from '../twitter/controllers';
import { createWebsiteFromTemplate } from '../nimi/controllers';

async function register(server: Server) {
  // Return nothing
  server.route({
    method: '*',
    path: '/',
    handler: async (_, h) => h.response().code(204),
  });

  server.route({
    method: 'GET',
    path: '/twitter-info',
    options: {
      validate: {
        query: {
          username: Joi.string().required(),
        },
      },
      tags: ['api', 'twitter'],
    },
    handler: twitter.getTwitterProfileByUsername,
  });

  server.route({
    method: 'POST',
    path: '/nimi/publish',
    options: {
      tags: ['api', 'cards'],
    },
    handler: createWebsiteFromTemplate,
  });
}

export const AuthRoutesPlugin = {
  name: 'nimi-api/routes',
  version: '0.0.1',
  register,
};

export default AuthRoutesPlugin;

