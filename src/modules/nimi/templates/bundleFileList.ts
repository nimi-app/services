import { dirname, join, resolve } from 'path';
import { readdir } from 'fs/promises';

import { ExtendedDirent } from './ExtendedDirent';

const nimiCardBuildDirectoryPath = resolve(
  dirname(require.resolve('nimi-card')),
  '../../build'
);

let fileListCache: ExtendedDirent[] = [];

async function traverseDir(
  dir: string,
  parentDiretory?: string
): Promise<ExtendedDirent[]> {
  const directoryFileList = await readdir(dir, { withFileTypes: true });
  const result: ExtendedDirent[] = [];

  for await (const file of directoryFileList) {
    const path = join(parentDiretory || '', file.name);
    const absolutePath = join(dir, file.name);
    const isDirectory = file.isDirectory();
    const subDirParentDirectory = isDirectory
      ? join(parentDiretory || '', file.name)
      : undefined;

    if (isDirectory) {
      const subDirFileList = await traverseDir(
        absolutePath,
        subDirParentDirectory
      );
      result.push(...subDirFileList);
    } else {
      result.push(
        new ExtendedDirent({
          path,
          absolutePath,
          name: file.name,
          isDirectory,
          isFile: file.isFile(),
          isBlockDevice: file.isBlockDevice(),
          isCharacterDevice: file.isCharacterDevice(),
          isSymbolicLink: file.isSymbolicLink(),
          isFIFO: file.isFIFO(),
          isSocket: file.isSocket(),
        })
      );
    }
  }

  return result;
}

export async function getCardFileList() {
  if (fileListCache.length > 0) {
    return fileListCache;
  }

  fileListCache = (await traverseDir(nimiCardBuildDirectoryPath)).filter(
    file => !file.name.toLowerCase().includes('data.json')
  );

  return fileListCache;
}

