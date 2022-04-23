import { Server } from '@hapi/hapi';
import Joi from 'joi';

// Controllers
import { twitter } from '../twitter/controllers';
import { templates } from '../templates/controllers';

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
    method: 'GET',
    path: '/templates',
    options: {
      tags: ['api', 'cards'],
    },
    handler: templates.getAllTemplates,
  });

  server.route({
    method: 'POST',
    path: '/templates/{templateId}/create',
    options: {
      tags: ['api', 'cards'],
    },
    handler: templates.createWebsiteFromTemplate,
  });
}

export const AuthRoutesPlugin = {
  name: 'nimi-api/routes',
  version: '0.0.1',
  register,
};

export default AuthRoutesPlugin;

