import NodeFormData from 'form-data';
import { File } from '../../util';
import axios from 'axios';
import {
  Web3StorageServiceParams,
  Web3StorageServicePinOptions,
  Web3StorageServicePinResponse,
  IWeb3StorageService,
} from './Web3Storage.types';

export class Web3StorageService implements IWeb3StorageService {
  public readonly baseUrl = 'https://api.web3.storage';
  public readonly accessToken: string;

  constructor({ accessToken }: Web3StorageServiceParams) {
    this.accessToken = accessToken;
  }

  async pinFiles(
    fileList: Array<File>,
    options?: Web3StorageServicePinOptions
  ) {
    const data = new NodeFormData();
    const requestUrl = new URL('/upload', this.baseUrl);

    fileList.forEach(({ stream, ...rest }) => {
      data.append('file', stream, rest);
    });

    const headers: Record<string, string> = {
      'Content-type': `multipart/form-data; boundary= ${data.getBoundary()}`,
      authorization: `Bearer ${this.accessToken}`,
    };

    if (options) {
      if (options.name) {
        headers['X-Name'] = encodeURIComponent(options?.name);
      }
    }

    const response = await axios
      .post<Web3StorageServicePinResponse>(requestUrl.toString(), data, {
        withCredentials: true,
        maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
        maxBodyLength: Infinity,
        headers,
      })
      .then(res => res.data);

    return response;
  }
}

