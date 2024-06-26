const NO_PHOTO_URL =
  'https://zm61.ru/upload/iblock/84b/srjklt20apje627nhctsvp8voy5oxppg.jpg';

const IMAGE_FILE_TYPE = /(jpg|jpeg|png|webp)$/;
const MAX_FILE_SIZE = 10e6;
const AUTH_REDIRECT_ROUTE = '/vinyl?offset=0&limit=10';
const LOGOUT_REDIRECT_ROUTE = '/auth/google';

const PORT_CONFIG_KEY = 'PORT';
const JWT_SECRET_CONFIG_KEY = 'JWT_SECRET_KEY';
const JWT_TOKEN_EXPIRES_IN_CONFIG_KEY = 'JWT_TOKEN_EXPIRES_IN';
const JWT_REFRESH_SECRET_CONFIG_KEY = 'JWT_REFRESH_KEY';
const JWT_REFRESH_TOKEN_EXPIRES_IN_CONFIG_KEY = 'REFRESH_TOKEN_EXPIRES_IN';
const GOOGLE_CLIENT_ID_CONFIG_KEY = 'GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET_CONFIG_KEY = 'GOOGLE_CLIENT_SECRET';
const GOOGLE_CALLBACK_URL_CONFIG_KEY = 'GOOGLE_CALLBACK_URL';
const CLOUD_NAME_CONFIG_KEY = 'CLOUD_NAME';
const CLOUD_API_CONFIG_KEY = 'CLOUD_API_KEY';
const CLOUD_API_SECRET_CONFIG_KEY = 'CLOUD_API_SECRET';
const GMAIL_EMAIL_CONFIG_KEY = 'GMAIL_EMAIL';
const GMAIL_APP_PASS_CONFIG_KEY = 'GMAIL_APP_PASS';
const STRIPE_SECRET_CONFIG_KEY = 'STRIPE_SECRET_KEY';
const DOMAIN_CONFIG_KEY = 'DOMAIN';
const STRIPE_CURRENCY_CONFIG_KEY = 'STRIPE_CURRENCY';

const ACCESS_TOKEN_COOKIE = 'access';
const REFRESH_TOKEN_COOKIE = 'refresh';

const USER_NOT_FOUND_MESSAGE = 'User not found';
const REVIEW_NOT_FOUND_MESSAGE = 'Review not found';
const ONE_REVIEW_ALLOWED_MESSAGE = 'Only one review per vinyl is allowed';
const VINYL_NOT_FOUND_MESSAGE = 'Vinyl not found';

const GOOGLE_STRATEGY_NAME = 'google';
const JWT_AUTH_STRATEGY_NAME = 'jwt-auth';
const JWT_REFRESH_STRATEGY_NAME = 'jwt-refresh';

const DEFAULT_STRING_VALUE = '';

const CLOUDINARY_PROVIDER_TOKEN = 'CLOUDINARY';

const POSTGRES_DATABASE_TYPE = 'postgres';

const ADMIN_FIRST_NAME = 'Iryna';
const ADMIN_LAST_NAME = 'Nikalayeva';
const ADMIN_BIRTHDATE = '2002-10-24';

const TRANSPORTER_HOST = 'smtp.gmail.com';
const TRANSPORTER_DEFAULT_FROM = '"No Reply" <noreply@example.com>';
const PAYMENT_SUCCEDED_MAIL_SUBJECT = 'The payment succeded!';
const getPaymentSuccededMailText = (
  price: number,
  name: string,
  authorName: string,
) =>
  `The payment (${price}$) for your new vinyl record was successfully completed!\n\n
Your new vinyl record:\n
Name: ${name}\n
Author Name: ${authorName}\n\n
Please, leave a review of it!\n\n
Best regards,\n
Your vinyl store :)`;

const CHECKOUT_SESSION_COMPLETED_EVENT_TYPE = 'checkout.session.completed';
const STRIPE_API_VERSION = '2024-04-10';

const AVATAR_FIELD = 'avatar';
const IMAGE_FIELD = 'image';

export {
  IMAGE_FILE_TYPE,
  MAX_FILE_SIZE,
  NO_PHOTO_URL,
  AUTH_REDIRECT_ROUTE,
  LOGOUT_REDIRECT_ROUTE,
  PORT_CONFIG_KEY,
  JWT_SECRET_CONFIG_KEY,
  JWT_TOKEN_EXPIRES_IN_CONFIG_KEY,
  JWT_REFRESH_SECRET_CONFIG_KEY,
  JWT_REFRESH_TOKEN_EXPIRES_IN_CONFIG_KEY,
  GOOGLE_CLIENT_ID_CONFIG_KEY,
  GOOGLE_CALLBACK_URL_CONFIG_KEY,
  GOOGLE_CLIENT_SECRET_CONFIG_KEY,
  CLOUD_API_CONFIG_KEY,
  CLOUD_API_SECRET_CONFIG_KEY,
  CLOUD_NAME_CONFIG_KEY,
  GMAIL_APP_PASS_CONFIG_KEY,
  GMAIL_EMAIL_CONFIG_KEY,
  DOMAIN_CONFIG_KEY,
  STRIPE_SECRET_CONFIG_KEY,
  STRIPE_CURRENCY_CONFIG_KEY,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  USER_NOT_FOUND_MESSAGE,
  REVIEW_NOT_FOUND_MESSAGE,
  ONE_REVIEW_ALLOWED_MESSAGE,
  VINYL_NOT_FOUND_MESSAGE,
  GOOGLE_STRATEGY_NAME,
  JWT_AUTH_STRATEGY_NAME,
  JWT_REFRESH_STRATEGY_NAME,
  DEFAULT_STRING_VALUE,
  CLOUDINARY_PROVIDER_TOKEN,
  POSTGRES_DATABASE_TYPE,
  ADMIN_BIRTHDATE,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
  TRANSPORTER_DEFAULT_FROM,
  TRANSPORTER_HOST,
  PAYMENT_SUCCEDED_MAIL_SUBJECT,
  getPaymentSuccededMailText,
  CHECKOUT_SESSION_COMPLETED_EVENT_TYPE,
  STRIPE_API_VERSION,
  AVATAR_FIELD,
  IMAGE_FIELD,
};
