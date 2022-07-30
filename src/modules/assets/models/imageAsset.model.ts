import { cid as isIPFSCID } from 'is-ipfs';
import MongooseDelete from 'mongoose-delete';
import { model, Schema } from 'mongoose';
import { IImageAsset } from '../interfaces/ImageAsset.interface';

export const ImageAssetSchema = new Schema<IImageAsset>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    cid: {
      type: Schema.Types.String,
      alias: 'cidV0',
    },
    cidV1: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serialised.
ImageAssetSchema.set('toJSON', {
  virtuals: true,
}).set('toObject', {
  virtuals: true,
});

ImageAssetSchema.index({
  name: 'text',
}).index({
  '$**': 'text',
});

ImageAssetSchema.pre('validate', function preValidate(next) {
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

ImageAssetSchema.plugin(MongooseDelete, {
  deletedAt: true,
});

// register the model and export it
export const ImageAssetModel = model<IImageAsset>(
  'ImageAsset',
  ImageAssetSchema
);

