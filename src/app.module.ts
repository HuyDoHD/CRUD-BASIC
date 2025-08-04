import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Modules } from './modules';
import { ConfigModule } from '@nestjs/config';
import { AgendaModule } from './agenda/agenda.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb',
    ),
    AgendaModule,
    AuthModule,
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
