import mongoose from 'mongoose';
import { env } from './env';

declare global {
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections from growing exponentially during API Route usage.
 */
let cached = global._mongoosePromise;

if (!cached) {
  cached = global._mongoosePromise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });
}

export async function connectDB(): Promise<typeof mongoose> {
  const connection = await cached!;

  if (env.NODE_ENV === 'development') {
    if (mongoose.connection.readyState === 1) {
      console.log('Using cached MongoDB connection');
    } else {
      console.log('MongoDB connected');
    }
  }

  return connection;
}
