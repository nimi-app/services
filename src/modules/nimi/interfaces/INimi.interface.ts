import { Nimi } from 'nimi-card';
import { MongoDocument } from 'src/modules/shared/interfaces/MongoDocument.interface';

export interface INimi extends MongoDocument {
  publisher: string;
  cid: string;
  nimi: Nimi;
}

