import { cid as isIPFSCID } from 'is-ipfs';
import MongooseDelete from 'mongoose-delete';
import MongoosePaginate from 'mongoose-paginate-v2';
import { nimiCard } from 'nimi-card';
import { PaginateModel, model, Schema } from 'mongoose';
import { INimi } from '../interfaces/INimi.interface';

export const NimiSchema = new Schema<INimi>(
  {
    publisher: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    cid: {
      type: Schema.Types.String,
      alias: 'cidV0',
    },
    cidV1: {
      type: Schema.Types.String,
    },
    nimi: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validator: (v: any) => nimiCard.validate(v),
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serialised.
NimiSchema.set('toJSON', {
  virtuals: true,
}).set('toObject', {
  virtuals: true,
});

NimiSchema.index({
  name: 'text',
}).index({
  '$**': 'text',
});

NimiSchema.plugin(MongooseDelete, {
  deletedAt: true,
});

// paginate with this plugin
NimiSchema.plugin(MongoosePaginate);

NimiSchema.pre('validate', function preValidate(next) {
  const hasCID = this.cid && this.cid.trim() !== '';
  const hasCIDV1 = this.cidV1 && this.cidV1.trim() !== '';

  // Both CID and CIDv1 are missing
  if (!hasCID && !hasCIDV1) {
    return next(new Error('Either cid or cidV1 must be provided'));
  }

  if (hasCID) {
    if (!isIPFSCID(this.cid)) {
      return next(new Error(`${this.cid} is not a valid IPFS CIDv0`));
    }
  }

  if (hasCIDV1) {
    if (!isIPFSCID(this.cidV1)) {
      return next(new Error(`${this.cidV1} is not a valid IPFS CIDv1`));
    }
  }

  return next();
});

// register the model and export it
export const NimiModel = model<INimi, PaginateModel<INimi>>('Nimi', NimiSchema);

