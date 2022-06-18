interface ExtendedDirentParams {
  path: string;
  absolutePath: string;
  name: string;
  isDirectory: boolean;
  isFile: boolean;
  isBlockDevice: boolean;
  isCharacterDevice: boolean;
  isSymbolicLink: boolean;
  isFIFO: boolean;
  isSocket: boolean;
}

export class ExtendedDirent {
  public readonly path: string;
  public readonly absolutePath: string;
  public readonly name: string;
  public readonly isFile: boolean;
  public readonly isDirectory: boolean;
  public readonly isBlockDevice: boolean;
  public readonly isCharacterDevice: boolean;
  public readonly isSymbolicLink: boolean;
  public readonly isFIFO: boolean;
  public readonly isSocket: boolean;

  constructor({
    path,
    isBlockDevice,
    isCharacterDevice,
    isDirectory,
    isFIFO,
    isFile,
    isSocket,
    isSymbolicLink,
    name,
    absolutePath,
  }: ExtendedDirentParams) {
    this.path = path;
    this.absolutePath = absolutePath;
    this.name = name;
    this.isFile = isFile;
    this.isDirectory = isDirectory;
    this.isBlockDevice = isBlockDevice;
    this.isCharacterDevice = isCharacterDevice;
    this.isSymbolicLink = isSymbolicLink;
    this.isFIFO = isFIFO;
    this.isSocket = isSocket;
  }
}

