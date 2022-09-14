import { Module } from '@nestjs/common';
import { FirebaseAdminModule } from '@tfarras/nestjs-firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { BenchesModule } from '../benches/benches.module';
import { ImagesModule } from '../images/images.module';
import { RedisModule } from '../redis/redis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.load(
      path.resolve(__dirname, 'config', '**', '!(*.d).{ts,js}'),
    ),
    FirebaseAdminModule.forRoot({
      // @ts-ignore
      projectId: applicationDefault().projectId,
      credential: applicationDefault(),
    }),
    AdminModule,
    AuthModule,
    BenchesModule,
    ImagesModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
