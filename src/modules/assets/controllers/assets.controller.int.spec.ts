import { Server } from '@hapi/hapi';
import pinataClient, { PinataPinResponse } from '@pinata/sdk';
import FormData from 'form-data';
import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamToPromise = require('stream-to-promise');

// Modules
import { create, configure } from '../../../server';

describe.skip('Assets Controllers', () => {
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

  describe('createWebsiteFromTemplate', () => {
    test('should create a Nimi card website from a template', async () => {
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

      // ---- END OF TEST ----
      // clean up IPFS
      const ipfsClient = pinataClient(
        process.env.PINATA_API_KEY as string,
        process.env.PINATA_API_SECRET as string
      );
      await ipfsClient.unpin(
        (signupRes?.result as { data: PinataPinResponse }).data.IpfsHash
      );
    });
  });
});

