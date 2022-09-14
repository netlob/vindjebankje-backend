import 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

declare module 'express' {
  export interface Request {
    jwt?: DecodedIdToken;
  }
}
