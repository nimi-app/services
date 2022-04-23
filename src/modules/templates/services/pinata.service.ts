import pinataSDK, { PinataClient, PinataPinOptions } from '@pinata/sdk';

interface PinataServiceConstructorParams {
  key: string;
  secret: string;
}

export class PinataService {
  private client: PinataClient;

  constructor({ key, secret }: PinataServiceConstructorParams) {
    this.client = pinataSDK(key, secret);
  }

  pinFromFS(sourcePath: string, options?: PinataPinOptions | undefined) {
    return this.client.pinFromFS(sourcePath, options);
  }
}

