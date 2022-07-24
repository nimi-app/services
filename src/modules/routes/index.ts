import { Server } from '@hapi/hapi';
import Joi from 'joi';

// Controllers
import { twitter } from '../twitter/controllers';
import { getNimis, publishNimi } from '../nimi/controllers';
import { uploadImageAssetToIPFS } from '../assets';
import {
  createNimiConnectBearerSession,
  createNimiConnectRequest,
} from '../nimi-connect';

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
      description: 'Get a Twitter profile info by username',
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
      description: 'Publish a Nimi',
      tags: ['api', 'cards'],
    },
    handler: publishNimi,
  });

  server.route({
    method: 'GET',
    path: '/nimis',
    options: {
      description: 'List Nimis',
      tags: ['api', 'cards'],
    },
    handler: getNimis,
  });

  server.route({
    method: 'POST',
    path: '/nimi/connect/token',
    options: {
      description: 'Create a Nimi Connect Bearer Session',
      tags: ['api', 'nimi connect'],
    },
    handler: createNimiConnectBearerSession,
  });

  server.route({
    method: 'POST',
    path: '/nimi/{ensName}/connect',
    options: {
      description: 'Create a Nimi Connect Request to another ENS/Nimi',
      tags: ['api', 'nimi connect'],
    },
    handler: createNimiConnectRequest,
  });

  server.route({
    method: 'POST',
    path: '/nimi/assets',
    options: {
      description: 'Upload an image asset to IPFS',
      payload: {
        allow: ['multipart/form-data'],
        parse: true,
        multipart: {
          output: 'stream',
        },
        maxBytes: 2 * 1024 * 1024, // 2MB
      },
      tags: ['api', 'assets'],
    },
    handler: uploadImageAssetToIPFS,
  });
}

export const AuthRoutesPlugin = {
  name: 'nimi-api/routes',
  version: '0.0.1',
  register,
};

export default AuthRoutesPlugin;

