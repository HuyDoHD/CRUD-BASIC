import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter);
  console.log('ENV MONGO_URI:', process.env.MONGO_URI);
  setupSwagger(app);
  await app.init();

  return serverlessExpress({ app: expressApp });
}

export const handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('🔥 Lambda invoked with event:', JSON.stringify(event));
  console.log('🔥 Context:', context);
  if (!server) {
    console.log('⚡ Bootstrapping new NestJS app...');
    server = await bootstrap();
  }
  return server(event, context, callback);
};
