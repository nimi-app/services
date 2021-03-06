import { NimiBlockchain } from 'nimi-card';
import { createNimiCardBundle } from '.';

describe('Nimi Templates', () => {
  describe('createNimiCardBundle', () => {
    test('Should create a bundle', async () => {
      const bundle = await createNimiCardBundle({
        addresses: [
          {
            address: '0x0000000000000000000000000000000000000000',
            blockchain: NimiBlockchain.ETHEREUM,
          },
        ],
        displayName: 'Test',
        ensName: 'nimi.eth',
        ensAddress: '0x0000000000000000000000000000000000000000',
        links: [],
        description: 'test',
        displayImageUrl: 'https://test.com/test.png',
        widgets: [],
      });

      expect(Array.isArray(bundle.files)).toBeTruthy();
      expect(
        bundle.files.find(file => file.filename === 'index.html')
      ).toBeDefined();
    });
  });
});

