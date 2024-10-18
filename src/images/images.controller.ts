import { 
  Body, 
  Controller, 
  Post,
  UploadedFiles, 
  UseInterceptors
} from '@nestjs/common';

import {  FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { FileFilter, FileNameHelper } from './helpers';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
  ) {}

  @Post('upload')
  @UseInterceptors( FilesInterceptor('files', 10, {
    // Aplicar filtro
    fileFilter: FileFilter,
    // Admite tamaño maximo de 2MB
    limits: { fileSize: 2 * 1024 * 1024 },
    storage: diskStorage({
      destination: './uploads',
      filename: FileNameHelper
    })
  }))
  uploadImages( @UploadedFiles() files: Array<Express.Multer.File>, @Body() uploadImageDto: UploadImageDto ) {
    return this.imagesService.uploadImages( files, uploadImageDto );
  }

}
