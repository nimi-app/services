import MongooseDelete from 'mongoose-delete';
import { model, Schema } from 'mongoose';
import { ITwitterUser } from '../interfaces/TwitterUser.interface';

export const TwitterUserSchema = new Schema<ITwitterUser>(
  {
    name: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
    username: {
      type: Schema.Types.String,
      required: true,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    protected: {
      type: Schema.Types.Boolean,
      default: false,
    },
    location: {
      type: Schema.Types.String,
    },
    url: {
      type: Schema.Types.String,
    },
    followersCount: {
      type: Schema.Types.Number,
    },
    followingCount: {
      type: Schema.Types.Number,
    },
    profileImageUrl: {
      type: Schema.Types.String,
    },
    twitterId: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

// Ensure virtual fields are serialised.
TwitterUserSchema.set('toJSON', {
  virtuals: true,
}).set('toObject', {
  virtuals: true,
});

TwitterUserSchema.index({
  name: 'text',
  username: 'text',
}).index({
  '$**': 'text',
});

TwitterUserSchema.plugin(MongooseDelete, {
  deletedAt: true,
});

// register the model and export it
export const TwitterUserModel = model<ITwitterUser>(
  'TwitterUser',
  TwitterUserSchema
);

