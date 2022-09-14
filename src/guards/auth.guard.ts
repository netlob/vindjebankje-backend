import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  FirebaseAdminSDK,
  FIREBASE_ADMIN_INJECT,
} from '@tfarras/nestjs-firebase-admin';

const FIREBASE_ADMIN_USER_IDS = process.env.FIREBASE_ADMIN_USER_IDS.split(',');
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_ADMIN_INJECT) private readonly fireSDK: FirebaseAdminSDK,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization as string;

    try {
      request.jwt = await this.fireSDK.auth().verifyIdToken(token);
    } catch (e) {
      return false;
    }

    return true;
  }
}

@Injectable()
export class FirebaseOptionalAuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_ADMIN_INJECT) private readonly fireSDK: FirebaseAdminSDK,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization as string;

    try {
      request.jwt = await this.fireSDK.auth().verifyIdToken(token);
    } catch (e) {}

    return true;
  }
}

@Injectable()
export class FirebaseAdminAuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_ADMIN_INJECT) private readonly fireSDK: FirebaseAdminSDK,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization as string;

    try {
      request.jwt = await this.fireSDK.auth().verifyIdToken(token);
    } catch (e) {}

    return FIREBASE_ADMIN_USER_IDS.includes(request.jwt?.uid);
  }
}
