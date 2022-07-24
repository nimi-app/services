import { Nimi } from 'nimi-card';
import { MongoDocument } from 'src/modules/shared/interfaces/MongoDocument.interface';

export interface INimi extends MongoDocument {
  publisher: string;
  cid: string;
  cidV0: string;
  cidV1: string;
  nimi: Nimi;
}

