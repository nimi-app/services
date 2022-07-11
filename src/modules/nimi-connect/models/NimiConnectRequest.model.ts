import MongooseDelete from 'mongoose-delete';
import { model, Schema } from 'mongoose';
import { isAddress } from '@ethersproject/address';
import {
  INimiConnectRequest,
  NimiConnectRequestStatus,
} from '../interfaces/INimiConnectRequest.interface';

export const NimiConnectRequestSchema = new Schema<INimiConnectRequest>(
  {
    status: {
      type: Schema.Types.String,
      required: true,
      enum: [
        NimiConnectRequestStatus.PENDING,
        NimiConnectRequestStatus.ACCEPTED,
        NimiConnectRequestStatus.REJECTED,
      ],
      default: NimiConnectRequestStatus.PENDING,
    },
    fromENSName: {
      type: Schema.Types.String,
      required: true,
    },
    fromAddress: {
      type: Schema.Types.String,
      required: true,
      validate: {
        validator: isAddress,
      },
    },
    toENSName: {
      type: Schema.Types.String,
      required: true,
    },
    toAddress: {
      type: Schema.Types.String,
      required: true,
      validate: {
        validator: isAddress,
      },
    },
    msssage: {
      type: Schema.Types.String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serialised.
NimiConnectRequestSchema.set('toJSON', {
  virtuals: true,
}).set('toObject', {
  virtuals: true,
});

NimiConnectRequestSchema.index({
  name: 'text',
}).index({
  '$**': 'text',
});

NimiConnectRequestSchema.plugin(MongooseDelete, {
  deletedAt: true,
});

// register the model and export it
export const NimiConnectRequest = model<INimiConnectRequest>(
  'NimiConnectRequest',
  NimiConnectRequestSchema
);

