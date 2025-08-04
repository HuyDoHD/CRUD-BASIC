import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Modules } from './modules';
import { ConfigModule } from '@nestjs/config';
import { AgendaModule } from './agenda/agenda.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb',
    ),
    AgendaModule,
    ...Modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
