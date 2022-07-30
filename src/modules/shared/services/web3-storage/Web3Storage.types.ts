import type { File } from '../../util';

export interface IWeb3StorageService {
  readonly baseUrl: string;
  readonly accessToken: string;
  /**
   */
  pinFiles(
    fileList: Array<File>,
    options?: Web3StorageServicePinOptions
  ): Promise<Web3StorageServicePinResponse>;
}

export interface Web3StorageServiceParams {
  accessToken: string;
}

export interface Web3StorageServicePinOptions {
  name?: string;
}

export interface Web3StorageServicePinResponse {
  cid: string;
}

