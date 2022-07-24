import { captureException } from '@sentry/node';
import { Request } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { getMimeType } from 'stream-mime-type';
import { PinataService } from '../../shared/services/pinata';
import { File } from '../../shared/util';
// Constants
import { PINATA_API_KEY, PINATA_API_SECRET } from '../../config/config.service';
import { ImageAssetModel } from '../models';

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
];

/**
 * Create a Nimi card website from a template
 */
export async function uploadImageAssetToIPFS(
  req: IUploadImageAssetToIPFSRequest
) {
  try {
    const { stream, mime } = await getMimeType(req.payload.file);

    // Validate the mime type
    if (!mime || !supportedMimeTypes.includes(mime) || !stream) {
      throw Boom.badRequest('Unsupported file type');
    }

    // Start uploading the IPFS files
    const pinataService = new PinataService({
      key: PINATA_API_KEY,
      secret: PINATA_API_SECRET,
    });

    const assetFile = new File({
      stream,
      filename: 'image',
      contentType: mime,
      filepath: 'image',
      name: 'image',
    });

    const pinFilesResults = await pinataService.pinFiles([assetFile]);

    // Save a copy to the database
    await new ImageAssetModel({
      cid: pinFilesResults.IpfsHash,
      description: '',
      name: '',
      createdAt: pinFilesResults.Timestamp,
    });

    return {
      data: pinFilesResults,
    };
  } catch (error) {
    console.log(error);
    captureException(error);
    throw Boom.badRequest(error);
  }
}

