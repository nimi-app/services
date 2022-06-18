import { createReadStream } from 'fs';
import { Nimi, nimiCard } from 'nimi-card';
import { Readable } from 'stream';
import { File } from '../services';
import dayjsUTCPlugin from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { getCardFileList } from './bundleFileList';
import { join } from 'path';

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

  const name = `nimi-card--${validatedNimiCard.ensName}-${dayjs()
    .utc()
    .format('YYYY-MM-DDT-HH-mm-ss')}`;

  // Create the bundle
  const bundleFiles = templateFileList.map(file => {
    return new File({
      stream: createReadStream(file.absolutePath),
      filename: file.name,
      contentType: 'application/octet-stream',
      filepath: join('public', file.path),
    });
  });

  const files = [
    ...bundleFiles,
    new File({
      stream: Readable.from([JSON.stringify(validatedNimiCard)]),
      filename: 'data.json',
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

