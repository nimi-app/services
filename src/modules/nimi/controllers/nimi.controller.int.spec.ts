import mongoose from 'mongoose';
import { Server } from '@hapi/hapi';
import axios from 'axios';
import { Nimi } from 'nimi-card';
// Modules
import { create, configure } from '../../../server';
import { NimiModel } from '../models/Nimi.model';

jest.mock('axios');

const testIpfsHash = 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR';

(axios as jest.Mocked<typeof axios>).post.mockResolvedValue({
  data: {
    IpfsHash: testIpfsHash,
    PinSize: 10000,
    Timestamp: Date.now() / 1000,
  },
});

describe('Nimi Controllers', () => {
  let server: Server;

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
    server = await configure(create());
    await server.initialize();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await server.stop();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

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
    widgets: [],
  };

  describe('createWebsiteFromTemplate', () => {
    test('should create a Nimi card website from a template', async () => {
      const publisNimiRes = await server.inject({
        method: 'POST',
        url: '/nimi/publish',
        payload,
      });
      expect(publisNimiRes.statusCode).toBe(200);
    });
    test('should create a copy of the Nimi in database', async () => {
      const publisNimiRes = await server.inject({
        method: 'POST',
        url: '/nimi/publish',
        payload,
      });
      expect(publisNimiRes.statusCode).toBe(200);
      console.log(publisNimiRes.result);
      const nimiFromDatabase = await NimiModel.findOne({
        cid: testIpfsHash,
      });
      expect(nimiFromDatabase).toBeDefined();
      expect(nimiFromDatabase?.cid).toBe(testIpfsHash);
      expect(nimiFromDatabase?.publisher).toBe(payload.ensAddress);
      expect(nimiFromDatabase?.nimi).toEqual(payload);
    });
  });
});

