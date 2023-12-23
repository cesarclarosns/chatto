import { TTokenPayload } from '@features/auth/auth.types';

declare module 'express-serve-static-core' {
  interface Request {
    user: TTokenPayload;
  }
}

export {};
