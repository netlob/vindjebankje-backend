import {
  Controller,
  Get,
  Header,
  Inject,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  FirebaseAdminSDK,
  FIREBASE_ADMIN_INJECT,
} from '@tfarras/nestjs-firebase-admin';
import { JWT } from '../../decorators/jwt.decorator';
import { FirebaseAuthGuard } from '../../guards/auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(FIREBASE_ADMIN_INJECT) private readonly fireSDK: FirebaseAdminSDK,
  ) {}

  @Get()
  async getHello(@Res() res) {
    res.redirect(301, 'https://vindjebankje.nl');
  }

  @Header('Cache-Control', 'no-cache')
  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async me(@JWT() jwt) {
    return await this.fireSDK.auth().getUser(jwt.uid);
  }
}
