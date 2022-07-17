import { captureException } from '@sentry/node';
import { Request } from '@hapi/hapi';
import { Nimi, nimiCard } from 'nimi-card';
import Boom from '@hapi/boom';

import { PinataService } from '../../shared/services';
// Constants
import { PINATA_API_KEY, PINATA_API_SECRET } from '../../config/config.service';
import { createNimiCardBundle } from '../templates';
import { NimiModel } from '../models/Nimi.model';

interface ICreateWebsiteFromTemplateRequest extends Request {
  payload: Nimi;
}

/**
 * Create a Nimi card website from a template
 */
export async function createWebsiteFromTemplate(
  req: ICreateWebsiteFromTemplateRequest
) {
  try {
    // validate the payload
    const validatedNimiCard = await nimiCard.validate(req.payload ?? {});

    // Start uploading the IPFS files
    const pinataService = new PinataService({
      key: PINATA_API_KEY,
      secret: PINATA_API_SECRET,
    });

    // Copy all files into memory
    const { files, name } = await createNimiCardBundle(
      validatedNimiCard as Nimi
    );

    const res = await pinataService.pinFiles(files, {
      pinataMetadata: {
        name,
      },
    });

    // Save a copy to database
    new NimiModel({
      publisher: validatedNimiCard.ensAddress,
      cid: res.IpfsHash,
      nimi: validatedNimiCard,
    })
      .save()
      .catch(err => {
        console.error(err);
        captureException(err);
      });

    return {
      data: res,
    };
  } catch (error) {
    console.log(error);
    captureException(error);
    throw Boom.badRequest(error);
  }
}

