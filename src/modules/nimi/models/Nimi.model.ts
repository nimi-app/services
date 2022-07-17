import MongooseDelete from 'mongoose-delete';
import { nimiCard } from 'nimi-card';
import { model, Schema } from 'mongoose';
import { INimi } from '../interfaces/INimi.interface';

export const NimiSchema = new Schema<INimi>(
  {
    publisher: {
      type: String,
      required: true,
      unique: true,
    },
    cid: {
      type: String,
      required: true,
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

// register the model and export it
export const NimiModel = model<INimi>('Nimi', NimiSchema);

