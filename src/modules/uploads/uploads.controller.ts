import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Body,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { createReadStream } from 'fs';

import { UploadsService } from './uploads.service';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Public, Roles } from '../../auth/decorators';
import { RoleNames } from '../users/role.entity';
import {
  HttpException,
  HttpExceptionMessage,
} from '../../utils/HttpExceptionFilter';

export const RECIPES_IMAGES_PATH = 'uploads/recipes/images';
export const INGREDIENTS_IMAGES_PATH = 'uploads/ingredients/images';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('uploads')
export class UploadsController {
  private readonly MAX_PRODUCT_IMAGE_SIZE_IN_KB = 5000;
  constructor(private readonly uploadsService: UploadsService) {}

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER)
  @Post('/recipes/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'temp/',
        filename: (req, file, cb) => {
          const splittedName = file.originalname.split('.');
          const ext = splittedName[splittedName.length - 1];

          cb(null, `${uuid()}.${ext}`);
        },
      }),
    }),
  )
  async uploadRecipeImages(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'File is required',
      );

    const fileExtension = file.originalname.split('.').pop();
    const fileSizes = file.size / 1024; // in kb
    const localFilePath = file.path;

    if (
      fileExtension !== 'png' &&
      fileExtension !== 'jpg' &&
      fileExtension !== 'jpeg'
    ) {
      this.uploadsService.deleteFile(localFilePath);
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'File must be a .png .jpg .jpeg file',
      );
    }

    if (fileSizes > this.MAX_PRODUCT_IMAGE_SIZE_IN_KB) {
      this.uploadsService.deleteFile(localFilePath);
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'File size must be less than 5MB',
      );
    }

    const fileName = file.filename;
    const filePath = `${RECIPES_IMAGES_PATH}/${uuid()}-${fileName}`;
    const fileStream = createReadStream(localFilePath);

    const uploadedFile = await this.uploadsService.uploadFileAndMakeItPublic(
      fileStream as any,
      filePath,
    );

    // Delete the file after it's uploaded to the cloud
    this.uploadsService.deleteFile(localFilePath);

    return uploadedFile;
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER)
  @Post('/ingredients/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'temp/',
        filename: (req, file, cb) => {
          const splittedName = file.originalname.split('.');
          const ext = splittedName[splittedName.length - 1];

          cb(null, `${uuid()}.${ext}`);
        },
      }),
    }),
  )
  async uploadIngredientImages(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'File is required',
      );

    const fileExtension = file.originalname.split('.').pop();
    const fileSizes = file.size / 1024; // in kb
    const localFilePath = file.path;

    if (
      fileExtension !== 'png' &&
      fileExtension !== 'jpg' &&
      fileExtension !== 'jpeg'
    ) {
      this.uploadsService.deleteFile(localFilePath);
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'File must be a .png .jpg .jpeg file',
      );
    }

    if (fileSizes > this.MAX_PRODUCT_IMAGE_SIZE_IN_KB) {
      this.uploadsService.deleteFile(localFilePath);
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'File size must be less than 5MB',
      );
    }

    const fileName = file.filename;
    const filePath = `${INGREDIENTS_IMAGES_PATH}/${uuid()}-${fileName}`;
    const fileStream = createReadStream(localFilePath);

    const uploadedFile = await this.uploadsService.uploadFileAndMakeItPublic(
      fileStream as any,
      filePath,
    );

    // Delete the file after it's uploaded to the cloud
    this.uploadsService.deleteFile(localFilePath);

    return uploadedFile;
  }
}
