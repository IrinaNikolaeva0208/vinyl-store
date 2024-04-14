const NO_PHOTO_URL =
  'https://zm61.ru/upload/iblock/84b/srjklt20apje627nhctsvp8voy5oxppg.jpg';

const FILE_TYPE = /(jpg|jpeg|png|webp)$/;
const MAX_FILE_SIZE = 10e6;
const AUTH_REDIRECT_ROUTE = '/vinyl?offset=0&limit=10';
const LOGOUT_REDIRECT_ROUTE = '/auth/google';

export {
  FILE_TYPE,
  MAX_FILE_SIZE,
  NO_PHOTO_URL,
  AUTH_REDIRECT_ROUTE,
  LOGOUT_REDIRECT_ROUTE,
};
