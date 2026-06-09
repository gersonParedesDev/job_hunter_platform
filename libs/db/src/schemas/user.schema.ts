import { Schema, model, models, Document } from 'mongoose';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<IUserDocument>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const UserModel = models.User || model<IUserDocument>('User', UserSchema);
