import pinataSDK, {
  PinataClient,
  PinataPinOptions,
  PinataPinResponse,
} from '@pinata/sdk';
import axios from 'axios';
import NodeFormData from 'form-data';

import { File } from '../../util/File';

interface PinataServiceConstructorParams {
  key: string;
  secret: string;
}

export class PinataService {
  private client: PinataClient;
  public readonly baseUrl = 'https://api.pinata.cloud';

  private apiKey: string;
  private apiSecret: string;

  constructor({ key, secret }: PinataServiceConstructorParams) {
    this.client = pinataSDK(key, secret);
    this.apiKey = key;
    this.apiSecret = secret;
    this.client.pinFileToIPFS;
  }

  pinFromFS(sourcePath: string, options?: PinataPinOptions | undefined) {
    return this.client.pinFromFS(sourcePath, options);
  }

  async pinFiles(
    fileList: Array<File>,
    options?: PinataPinOptions | undefined
  ) {
    const data = new NodeFormData();
    const endpoint = `${this.baseUrl}/pinning/pinFileToIPFS`;

    fileList.forEach(({ stream, ...rest }) => {
      data.append('file', stream, rest);
    });

    if (options) {
      if (options.pinataMetadata) {
        data.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
      }
      if (options.pinataOptions) {
        data.append('pinataOptions', JSON.stringify(options.pinataOptions));
      }
    }

    const response = await axios
      .post<PinataPinResponse>(endpoint, data, {
        withCredentials: true,
        maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
        maxBodyLength: Infinity,
        headers: {
          'Content-type': `multipart/form-data; boundary= ${data.getBoundary()}`,
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.apiSecret,
        },
      })
      .then(res => res.data);

    return response;
  }
}

