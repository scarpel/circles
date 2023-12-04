import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoInstance: MongoMemoryServer;

export async function closeMongoInstance() {
  return mongoInstance && mongoInstance.stop();
}

export function mockMongoRootSetup(options: MongooseModuleOptions = {}) {
  return MongooseModule.forRootAsync({
    useFactory: async () => {
      await closeMongoInstance();

      mongoInstance = await MongoMemoryServer.create();

      return {
        uri: mongoInstance.getUri(),
        ...options,
      };
    },
  });
}
