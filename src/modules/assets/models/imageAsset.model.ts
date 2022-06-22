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
      required: true,
      validate: {
        validator: isIPFSCID,
        message: 'CID is required',
      },
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

ImageAssetSchema.plugin(MongooseDelete, {
  deletedAt: true,
});

// register the model and export it
export const ImageAssetModel = model<IImageAsset>(
  'ImageAsset',
  ImageAssetSchema
);

