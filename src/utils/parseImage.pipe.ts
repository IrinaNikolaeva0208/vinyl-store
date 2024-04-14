import { ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FILE_TYPE, MAX_FILE_SIZE } from './constants';

export const ParseImagePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: FILE_TYPE,
  })
  .addMaxSizeValidator({
    maxSize: MAX_FILE_SIZE,
  })
  .build({
    fileIsRequired: false,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
