import MongooseDelete from 'mongoose-delete';
import { model, Schema } from 'mongoose';
import { ITemplate } from '../interfaces/templates.interface';

export const TemplateSchema = new Schema<ITemplate>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
    },
    fields: [],
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serialised.
TemplateSchema.set('toJSON', {
  virtuals: true,
}).set('toObject', {
  virtuals: true,
});

TemplateSchema.index({
  name: 'text',
}).index({
  '$**': 'text',
});

TemplateSchema.plugin(MongooseDelete, {
  deletedAt: true,
});

// register the model and export it
export const TemplateModel = model<ITemplate>('Template', TemplateSchema);

