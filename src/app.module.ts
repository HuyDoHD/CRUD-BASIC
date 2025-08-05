import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Modules } from './modules';
import { ConfigModule } from '@nestjs/config';
import { AgendaModule } from './agenda/agenda.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        console.log('🔗 MONGO_URI:', process.env.MONGO_URI);
        return {
          uri: process.env.MONGO_URI,
        };
      },
    }),
    AgendaModule,
    AuthModule,
    QueueModule,
    ...Modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude( 
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'user/create', method: RequestMethod.POST },
      )
      .forRoutes('*'); 
  }
}
