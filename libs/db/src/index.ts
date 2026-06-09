import mongoose from 'mongoose';

export async function connectToDatabase(uri: string): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }
  return mongoose.connect(uri);
}

export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export * from './schemas/user.schema';
export * from './schemas/profile.schema';
export { mongoose };
