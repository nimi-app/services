import { Server } from '@hapi/hapi';
import Joi from 'joi';

// Controllers
import { twitter } from '../twitter/controllers';
import { templates } from '../templates/controllers';

const createWebsiteFromTemplateValidationSchema = Joi.object({
  displayName: Joi.string().required().min(3),
  description: Joi.string().required().min(3),
  profileImageUrl: Joi.string().uri().required().default(''),
  ensAddress: Joi.string().required(),
  ensName: Joi.string().required(),
  socials: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        label: Joi.string()
          .valid(
            'twitter',
            'github',
            'medium',
            'linkedin',
            'reddit',
            'telegram',
            'facebook',
            'instagram',
            'youtube',
            'email'
          )
          .required(),
        url: Joi.string().uri().required(),
      })
    )
    .required(),

  addresses: Joi.array()
    .items(
      Joi.object({
        address: Joi.string().required(),
        network: Joi.string()
          .valid(
            'ethereum',
            'bitcoin',
            'polygon',
            'tron',
            'eos',
            'binance',
            'ripple',
            'dogecoin'
          )
          .required(),
      })
    )
    .required(),
});

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
    path: '/profiles/create',
    options: {
      tags: ['api', 'cards'],
      validate: {
        payload: createWebsiteFromTemplateValidationSchema,
      },
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

