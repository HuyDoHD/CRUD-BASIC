// test/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const connectInMemoryMongo = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

export const closeInMemoryMongo = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};
