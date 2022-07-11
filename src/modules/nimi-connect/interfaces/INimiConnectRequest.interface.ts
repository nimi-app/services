import { MongoDocument } from 'src/modules/shared/interfaces/MongoDocument.interface';

export enum NimiConnectRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface INimiConnectRequest extends MongoDocument {
  fromENSName: string;
  fromAddress: string;
  toENSName: string;
  toAddress: string;
  status: NimiConnectRequestStatus;
  msssage?: string;
}

