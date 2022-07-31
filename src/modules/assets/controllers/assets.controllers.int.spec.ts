import { Server } from '@hapi/hapi';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FormData from 'form-data';
import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamToPromise = require('stream-to-promise');

// Modules
import { create, configure } from '../../../server';
import { ImageAssetModel } from '../models';

// This sets the mock adapter on the default instance
const axiosMock = new MockAdapter(axios);

const testIpfsHash =
  'bafybeic3cfnuzh3rm7oqsbc3dfaahhxmrhmu52fdz2k5ozlxiarl7dt3km';

describe('Assets Controllers', () => {
  let server: Server;

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
    server = await configure(create());
    await server.initialize();
  });

  afterEach(async () => {
    await server.stop();
    await mongoose.disconnect();
  });

  describe('uploadImageAssetToIPFS', () => {
    test('should upload PNG asset to IPFS and save a local copy in database', async () => {
      axiosMock.onPost('https://api.web3.storage/upload').reply(200, {
        cid: testIpfsHash,
      });

      const formData = new FormData();

      formData.append(
        'file',
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==',
          'base64'
        ),
        {
          contentType: 'image/png',
          filename: 'image.png',
        }
      );

      const payload = await streamToPromise(formData);

      const signupRes = await server.inject({
        method: 'POST',
        url: '/nimi/assets',
        headers: formData.getHeaders(),
        payload: payload,
      });

      expect(signupRes.statusCode).toBe(200);
      expect((signupRes.result as any).data.cidV1).toEqual(testIpfsHash);
      const assetFromMongo = await ImageAssetModel.findOne({
        cidV1: testIpfsHash,
      });

      expect(assetFromMongo).toBeDefined();
    });
  });
});

