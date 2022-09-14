import {
  Body,
  Controller,
  Header,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWT } from '../../decorators/jwt.decorator';
import { FirebaseAuthGuard } from '../../guards/auth.guard';
import { ImagesService } from './images.service';

@Controller('/image')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Header('Cache-Control', 'no-cache')
  @Post('upload')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@JWT() jwt, @UploadedFile() file) {
    return await this.imagesService.uploadImage(jwt, file);
  }
}
