import { Schema, model, models, Document } from 'mongoose';

export interface IProfileDocument extends Document {
  id: string;
  userId: string;
  profession: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const ProfileSchema = new Schema<IProfileDocument>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  profession: { type: String, required: true },
  skills: { type: [String], default: [] },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const ProfileModel = models.Profile || model<IProfileDocument>('Profile', ProfileSchema);
