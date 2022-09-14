/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
const B2 = require('backblaze-b2');
const sharp = require('sharp');

const { BACKBLAZE_KEY_ID, BACKBLAZE_KEY, BACKBLAZE_BUCKET_ID } = process.env;

@Injectable()
export class ImagesService {
  readonly b2 = new B2({
    applicationKeyId: BACKBLAZE_KEY_ID,
    applicationKey: BACKBLAZE_KEY,
  });

  constructor() {
    this.b2.authorize();
    setInterval(async () => await this.b2.authorize(), 12 * 60 * 60 * 1000);
  }

  async uploadImage(auth: DecodedIdToken, file) {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
      throw new HttpException(
        'Invalid image format, must be either PNG, JPG or GIF',
        400,
      );
    }

    if (file.size > 300000) {
      // 300kb
      throw new HttpException(
        'Image too large, must be smaller than 300kb',
        400,
      );
    }

    // convert image to webp to reduce file size
    const buffer = await sharp(file.buffer).toFormat('webp').toBuffer();

    // get upload url from b2
    const { uploadUrl, authorizationToken } = (
      await this.b2.getUploadUrl({
        bucketId: BACKBLAZE_BUCKET_ID,
      })
    ).data;

    // generate filename
    const id = uuidv4();
    const fileName = `${id}.webp`;

    // upload file to b2
    const uploadedFile = (
      await this.b2.uploadFile({
        uploadUrl: uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: fileName,
        mime: 'image/webp',
        data: buffer,
        info: {
          publisherId: auth.uid,
        },
        onUploadProgress: null,
      })
    ).data;

    // TOOD: make url configurable
    // return cdn url
    const cdnUrl = `https://cdn.vindjebankje.nl/file/benches/${uploadedFile.fileName}`;
    return {
      url: cdnUrl,
    };
  }
}
