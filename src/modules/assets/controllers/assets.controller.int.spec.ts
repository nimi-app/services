import { Server } from '@hapi/hapi';
import axios from 'axios';
import FormData from 'form-data';
import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamToPromise = require('stream-to-promise');

// Modules
import { create, configure } from '../../../server';
import { ImageAssetModel } from '../models';

jest.mock('axios');

const testIpfsHash = 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR';

(axios as jest.Mocked<typeof axios>).post.mockResolvedValueOnce({
  data: {
    IpfsHash: testIpfsHash,
    PinSize: 10000,
    Timestamp: Date.now() / 1000,
  },
});

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
      expect((signupRes.result as any).data.IpfsHash).toEqual(testIpfsHash);

      const assetFromMongo = await ImageAssetModel.findOne({
        cid: testIpfsHash,
      });
      expect(assetFromMongo).toBeDefined();
    });
  });
});

