import { captureException } from '@sentry/node';
import { Request } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { getMimeType } from 'stream-mime-type';
import { File } from '../../shared/util';
// Constants
import { WEB3_STORAGE_ACCESS_TOKEN } from '../../config/config.service';
import { ImageAssetModel } from '../models';
import { APIGeneralResponse } from '../../shared/interfaces/response.interface';
import { Web3StorageService } from '../../shared/services';

interface IUploadImageAssetToIPFSRequest extends Request {
  payload: {
    file: NodeJS.ReadableStream;
  };
}

const supportedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

interface IUploadImageAssetToIPFSResponse {
  /**
   * The cid of the pin that was created CIDv1
   */
  cidV1: string;
}

/**
 * Create a Nimi card website from a template
 */
export async function uploadImageAssetToIPFS(
  req: IUploadImageAssetToIPFSRequest
): Promise<APIGeneralResponse<IUploadImageAssetToIPFSResponse>> {
  try {
    const { stream, mime } = await getMimeType(req.payload.file);

    // Validate the mime type
    if (!mime || !supportedMimeTypes.includes(mime) || !stream) {
      throw Boom.badRequest('Unsupported file type');
    }

    // Start uploading the IPFS files
    const web3StorageService = new Web3StorageService({
      accessToken: WEB3_STORAGE_ACCESS_TOKEN,
    });

    const name = req.headers['x-name'] || 'image';

    const assetFile = new File({
      stream,
      filename: 'image',
      contentType: mime,
      filepath: 'image',
      name,
    });

    const { cid } = await web3StorageService.pinFiles([assetFile]);

    // Save a copy to the database
    await new ImageAssetModel({
      cidV1: cid,
      description: '',
      name,
    }).save();

    return {
      data: {
        cidV1: cid,
      },
    };
  } catch (error) {
    console.log(error);
    captureException(error);
    throw Boom.badRequest(error);
  }
}

