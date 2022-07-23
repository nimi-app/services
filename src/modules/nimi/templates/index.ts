import { createReadStream } from 'fs';
import { Nimi, nimiCard } from 'nimi-card';
import { Readable } from 'stream';
import { File } from '../../shared/util/File';
import dayjsUTCPlugin from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { getCardFileList } from './bundleFileList';
import { join } from 'path';
import { createMetaTags } from './metaTags';
import { readFile } from 'fs/promises';

export * from './metaTags';

dayjs.extend(dayjsUTCPlugin);

interface ReactNimiCardApp {
  name: string;
  nimi: Nimi;
  files: File[];
}

/**
 *
 * @param nimi the card data
 */
export async function createNimiCardBundle(
  nimi: Nimi
): Promise<ReactNimiCardApp> {
  const templateFileList = await getCardFileList();

  const validatedNimiCard = await nimiCard.validate(nimi);

  const cardUrl = `https://${validatedNimiCard.ensName}.eth.limo`;

  const name = `nimi-card--${validatedNimiCard.ensName}-${dayjs()
    .utc()
    .format('YYYY-MM-DDT-HH-mm-ss')}`;

  // Create the bundle
  const bundleFiles = await Promise.all(
    templateFileList.map(async file => {
      // Default read stream
      let stream: NodeJS.ReadableStream | Buffer = createReadStream(
        file.absolutePath,
        'utf-8'
      );

      // Add metatags to index.html
      if (file.name === 'index.html') {
        const metaTags = createMetaTags({
          description: validatedNimiCard.description || '',
          title: `${validatedNimiCard.displayName} on Nimi`,
          imageUrl: './static/images/cover.png',
          url: cardUrl,
        });

        const indexHTMLContentWithMetaTags = (
          await readFile(file.absolutePath, 'utf-8')
        ).replace('</head>', `${metaTags}</head>`);

        stream = Readable.from([indexHTMLContentWithMetaTags]);
      }

      return new File({
        stream,
        name: file.name,
        filename: file.name,
        contentType: 'application/octet-stream',
        filepath: join('public', file.path),
      });
    })
  );

  const files = [
    ...bundleFiles,
    new File({
      stream: Readable.from([JSON.stringify(validatedNimiCard)]),
      filename: 'data.json',
      name: 'data.json',
      contentType: 'application/json',
      filepath: 'public/data.json',
    }),
  ];

  const app: ReactNimiCardApp = {
    name,
    nimi: validatedNimiCard as Nimi,
    files,
  };

  return app;
}

