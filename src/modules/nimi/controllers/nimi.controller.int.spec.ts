import { Server } from '@hapi/hapi';
import pinataClient, { PinataPinResponse } from '@pinata/sdk';
import { Nimi } from 'nimi-card';
// Modules
import { create, configure } from '../../../server';

describe.skip('Nimi Controllers', () => {
  let server: Server;

  beforeEach(async () => {
    server = await configure(create());
    await server.initialize();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe('createWebsiteFromTemplate', () => {
    test('should create a Nimi card website from a template', async () => {
      const payload: Nimi = {
        displayName: 'Nimi',
        displayImageUrl:
          'https://pbs.twimg.com/profile_images/1522297478565044225/x_huMFHD_400x400.jpg',
        addresses: [
          {
            address: '0x4e675ceB415fC41700fb821fF3B43cE5C8B9a83B',
            blockchain: 'ethereum',
          },
        ],
        description:
          'Host your personal page on your ENS domain! Nimi 0.1.alpha live on Ethereum Mainnet :) #devconnect #ETHAmsterdam',
        ensAddress: '0x4e675ceB415fC41700fb821fF3B43cE5C8B9a83B',
        ensName: 'nimi.eth',
        links: [
          {
            label: 'Twitter',
            type: 'twitter',
            url: '0xNimi',
          },
          {
            label: 'Github',
            type: 'github',
            url: 'nimi-app',
          },
          {
            label: 'Telegram',
            type: 'telegram',
            url: '0xNimi',
          },
          {
            label: 'Website',
            type: 'website',
            url: 'https://nimi.eth.limo',
          },
        ],
      };

      const signupRes = await server.inject({
        method: 'POST',
        url: '/nimi/publish',
        payload,
      });

      expect(signupRes.statusCode).toBe(200);

      console.log(signupRes.result);

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

