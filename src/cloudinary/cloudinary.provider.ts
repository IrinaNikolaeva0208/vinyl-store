import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import {
  CLOUDINARY_PROVIDER_TOKEN,
  CLOUD_API_CONFIG_KEY,
  CLOUD_API_SECRET_CONFIG_KEY,
  CLOUD_NAME_CONFIG_KEY,
} from 'src/utils/constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY_PROVIDER_TOKEN,
  useFactory: (configService: ConfigService) => {
    return v2.config({
      cloud_name: configService.get<string>(CLOUD_NAME_CONFIG_KEY),
      api_key: configService.get<string>(CLOUD_API_CONFIG_KEY),
      api_secret: configService.get<string>(CLOUD_API_SECRET_CONFIG_KEY),
    });
  },
  inject: [ConfigService],
};
