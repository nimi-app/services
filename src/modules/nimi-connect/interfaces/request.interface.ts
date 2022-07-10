import { Request } from '@hapi/hapi';

export interface ICreateNimiConnectSessionRequest extends Request {
  payload: {
    ensName: string;
    signature: string;
  };
}

export interface CreateNimiConnectSessionResponse {
  token: string;
  expiresAt: string;
  type: 'Bearer';
}

export interface JsonWebTokenPayload extends Record<string, unknown> {
  address: string;
  ensName: string;
}

export interface JsonWebTokenClaim extends JsonWebTokenPayload {
  exp: number;
  iss: string;
}

export interface ICreateNimiConnectRequestRequest extends Request {
  payload: {
    token: string;
  };
  params: {
    ensName: string;
  };
}

