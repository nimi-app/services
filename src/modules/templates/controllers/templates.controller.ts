import { captureException } from '@sentry/node';
import { Request } from '@hapi/hapi';
import Boom from '@hapi/boom';
import * as cheerio from 'cheerio';

// Constants
import { ITemplate } from '../interfaces/templates.interface';
import { writeFile, mkdir } from 'fs/promises';

import { PinataService } from '../services/pinata.service';

import {
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY,
} from '../services/../../config/config.service';
import { dirname, join } from 'path';
import { Profile } from '../nimimal-templates/types';
import dayjs from 'dayjs';

const APP_ABS_PATH = dirname(require?.main?.filename as string);
const PROFILES_DIR = join(APP_ABS_PATH, 'profiles');

const TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <link
      href="https://fonts.googleapis.com/css?family=Baloo+2:400,500,600|Open+Sans:400;600;700&amp;display=swap"
      rel="stylesheet"
    />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <title>Nimi</title>
    <script
      defer="defer"
      src="https://gateway.pinata.cloud/ipfs/QmSMZSWnbHfBx5oH6vQ8wTYQYRh88JbXuJZ4pZJsPVVV6S"
    ></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script id="config">
      window.__PROFILE_DATA__ = {
        displayName: 'stani.eth (👻,🌿)',
        description:
          'Founder @LensProtocol @AaveAave web3 investoooorrr - Contributor to @PleasrDAO @FlamingoDAO @VENTURE_DAO -\n          Opinions my own - Google 1998 vibes 🐬☁️',
        profileImageUrl:
          'https://pbs.twimg.com/profile_images/1512035047162982403/7IUjd723_400x400.jpg',
        ensAddress: '0x2E21f5d32841cf8C7da805185A041400bF15f21A',
        ensName: 'stani.eth',
        socials: [
          {
            id: 'twitter',
            label: '@StaniKulechov',
            url: 'https://twitter.com/StaniKulechov',
          },
          {
            id: 'instagram',
            label: '@StaniKulechov',
            url: 'https://instagram.com/stani.eth',
          },
          {
            id: 'email',
            label: 'stani@aave.com',
            url: 'mailto:stani@aave.com',
          },
        ],
        addresses: [
          {
            address: '0x2E21f5d32841cf8C7da805185A041400bF15f21A',
            network: 'ethereum',
          },
          {
            address: '0x2E21f5d32841cf8C7da805185A041400bF15f21A',
            network: 'polygon',
          },
        ],
      };
    </script>
  </body>
</html>

`;

mkdir(PROFILES_DIR, { recursive: true });

/**
 * Fetches Twitter information for a given username
 */
export async function getAllTemplates() {
  // Services
  try {
    // Placeholder
    const templates: ITemplate[] = [
      {
        name: 'Nimimal',
        id: 1,
        description: 'Template 1',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
        fields: [
          {
            name: 'field 1',
            id: 1,
            description: 'field 1',
            createdAt: '2020-01-01',
            updatedAt: '2020-01-01',
            type: 'string',
          },
        ],
      },
    ];

    return {
      data: templates,
    };
  } catch (e) {
    captureException(e);
    throw Boom.badRequest(e);
  }
}

interface ICreateWebsiteFromTemplateRequest extends Request {
  params: {
    templateId: string;
  };
  payload: Profile;
}

/**
 *
 */
export async function createWebsiteFromTemplate(
  req: ICreateWebsiteFromTemplateRequest
) {
  try {
    const { payload } = req;

    const $ = cheerio.load(TEMPLATE_HTML);

    $('#config').html(`window.__PROFILE_DATA__ = ${JSON.stringify(payload)}`);

    const pinataService = new PinataService({
      key: PINATA_API_KEY,
      secret: PINATA_SECRET_API_KEY,
    });

    const profielDir = join(
      PROFILES_DIR,
      `/${payload.ensAddress}-${dayjs().format('YYYY-MM-DDT-HH-mm-ss')}`
    );
    // create directory
    await mkdir(profielDir);
    const indexFilePath = join(profielDir, `/index.html`);

    await writeFile(indexFilePath, $.html(), {
      encoding: 'utf8',
      flag: 'w',
    });

    const res = await pinataService.pinFromFS(indexFilePath);

    return {
      data: res,
    };
  } catch (error) {
    console.log(error);
    captureException(error);
    throw Boom.badRequest(error);
  }
}

