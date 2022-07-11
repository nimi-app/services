import Boom from '@hapi/boom';
import { captureException } from '@sentry/node';
import { ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { verifyMessage } from '@ethersproject/wallet';

import { JsonWebTokenService } from '../../shared/services';
import {
  JSON_WEB_TOKEN_SECRET,
  NIMI_CONNECT_SIGNATURE_TEXT_PAYLOAD,
} from '../../config/config.service';
import { APIGeneralResponse } from 'src/modules/shared/interfaces/response.interface';
import dayjs from 'dayjs';
import { NimiConnectRequest } from '../models';
import { resolveENSName } from '../utils';
import {
  CreateNimiConnectSessionResponse,
  ICreateNimiConnectRequestRequest,
  ICreateNimiConnectSessionRequest,
  JsonWebTokenClaim,
  JsonWebTokenPayload,
} from '../interfaces/request.interface';

/**
 * Create a JWT session for Nimi holder. The JWT session is used to create a Nimi Connect Requests.
 */
export async function createNimiConnectBearerSession(
  req: ICreateNimiConnectSessionRequest
): Promise<APIGeneralResponse<CreateNimiConnectSessionResponse>> {
  try {
    const { signature, ensName } = req.payload;
    const addressFromSignature = verifyMessage(
      NIMI_CONNECT_SIGNATURE_TEXT_PAYLOAD,
      signature
    );

    const addressFromENSName = await resolveENSName(ensName);

    if (
      !addressFromENSName ||
      addressFromSignature.toLowerCase() !== addressFromENSName.toLowerCase()
    ) {
      throw new Error('Invalid signature');
    }

    // Create a JWT token
    const jsonWebTokenService = new JsonWebTokenService(JSON_WEB_TOKEN_SECRET);
    const jwtClaimExpiry = dayjs().add(7, 'day');
    const expiresAt = jwtClaimExpiry.toISOString();
    // Second until expiresAt
    const expiresIn = jwtClaimExpiry.diff(dayjs(), 'second');

    const tokenPayload: JsonWebTokenPayload = {
      address: addressFromENSName,
      ensName,
    };

    const token = await jsonWebTokenService.sign(tokenPayload, {
      issuer: 'Nimi',
      expiresIn,
      subject: addressFromENSName,
    });

    return {
      data: {
        token,
        expiresAt,
        type: 'Bearer',
      },
    };
  } catch (error) {
    console.log(error);
    captureException(error);
    throw Boom.badRequest(error);
  }
}

/**
 * Creates a connection request from one Nimi to another.
 * Validates Nimi JWT token, and create a connection request.
 * @todo If the Connection request is accepted by both parties, then create a Nimi Connect NFT to both parties on Optimism.
 */
export async function createNimiConnectRequest(
  req: ICreateNimiConnectRequestRequest,
  h: ResponseToolkit
): Promise<ResponseObject> {
  try {
    // Create a JWT token
    const jsonWebTokenService = new JsonWebTokenService(JSON_WEB_TOKEN_SECRET);

    const jwtClaim = await jsonWebTokenService.verify<JsonWebTokenClaim>(
      req.payload.token,
      {
        ignoreExpiration: false,
      }
    );

    const fromAddress = jwtClaim.address;
    const fromENSName = jwtClaim.ensName.toLowerCase();

    // Validate the ENS name
    const toAddress = await resolveENSName(req.params.ensName);
    const toENSName = req.params.ensName.toLowerCase();

    if (!toAddress) {
      throw new Error('Invalid ENS name');
    }

    const isNimiConnectRequestExists = await NimiConnectRequest.findOne({
      fromAddress,
      fromENSName,
      toAddress,
      toENSName,
    });

    if (isNimiConnectRequestExists) {
      throw new Error('Nimi connect request already exists');
    }

    // Create a Nimi connect request
    await new NimiConnectRequest({
      fromAddress,
      fromENSName,
      toAddress,
      toENSName,
    }).save();

    return h.response().code(201);
  } catch (error) {
    console.log(error);
    captureException(error);
    throw Boom.badRequest(error);
  }
}

