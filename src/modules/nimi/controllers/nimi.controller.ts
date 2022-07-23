import { captureException } from '@sentry/node';
import { Request } from '@hapi/hapi';
import { Nimi, nimiCard } from 'nimi-card';
import Boom from '@hapi/boom';

// Constants
import { WEB3_STORAGE_ACCESS_TOKEN } from '../../config/config.service';
import { createNimiCardBundle } from '../templates';
import { NimiModel } from '../models/Nimi.model';
import { Web3StorageService } from '../../shared/services/web3-storage';
import { APIGeneralResponse } from 'src/modules/shared/interfaces/response.interface';

interface IPublishNimiRequest extends Request {
  payload: Nimi;
}

interface PublishNimiRequestResponse {
  /**
   * The cid of the pin that was created CIDv1
   */
  cidV1: string;
}

/**
 * Create a Nimi card website from a template
 */
export async function publishNimi(
  req: IPublishNimiRequest
): Promise<APIGeneralResponse<PublishNimiRequestResponse>> {
  try {
    // validate the payload
    const validatedNimiCard = await nimiCard.validate(req.payload ?? {});

    const web3StorageService = new Web3StorageService({
      accessToken: WEB3_STORAGE_ACCESS_TOKEN,
    });

    // Copy all files into memory
    const { files, name } = await createNimiCardBundle(
      validatedNimiCard as Nimi
    );

    // Put
    const pinResponse = await web3StorageService.pinFiles(files, {
      name,
    });

    // Save a copy to database
    await new NimiModel({
      publisher: validatedNimiCard.ensAddress,
      cid: null,
      cidV1: pinResponse.cid,
      nimi: validatedNimiCard,
    })
      .save()
      .catch(err => {
        console.error(err);
        captureException(err);
      });

    return {
      data: {
        cidV1: pinResponse.cid,
      },
    };
  } catch (error) {
    console.log(error);
    captureException(error);
    throw Boom.badRequest(error);
  }
}

