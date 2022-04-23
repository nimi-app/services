import { Request } from '@hapi/hapi';

export type IRequest = Request;

export interface MongooseDocumentBase {
  createdAt: Date;
  updatedAt: Date;
}

