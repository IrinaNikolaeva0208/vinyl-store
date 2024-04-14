import { Request } from 'express';

export const cookieExtractor = function (key: string) {
  return function (req: Request) {
    let token = null;
    if (req && req.cookies) token = req.cookies[key];
    return token;
  };
};
