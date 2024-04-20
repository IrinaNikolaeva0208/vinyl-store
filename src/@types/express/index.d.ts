import { User as UserEntiy } from 'src/users/entities';

declare module 'express' {
  interface Request {
    user: Pick<UserEntiy, 'id' | 'email' | 'role'>;
  }
}
