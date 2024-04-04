import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, Endpoint } from 'aws-sdk';
import { unlink } from 'fs';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFileAndMakeItPublic(dataBuffer: Buffer, filePath: string) {
    const spacesEndpoint = new Endpoint('nyc3.digitaloceanspaces.com');
    const s3 = new S3({
      endpoint: spacesEndpoint,
    });

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Body: dataBuffer,
        Key: filePath,
        GrantRead: 'uri="http://acs.amazonaws.com/groups/global/AllUsers"',
      })
      .promise();

    const fileStorageInDB = {
      fileUrl: uploadResult.Location,
      key: uploadResult.Key,
    };

    return fileStorageInDB;
  }

  /**
   * Deletes Local File
   * @param filePath File Path to delete
   */
  async deleteFile(filePath) {
    await new Promise<void>((resolve) => {
      unlink(filePath, (error) => {
        if (error) {
          // tslint:disable-next-line:no-console
          console.error(
            `The file ${filePath} was not deleted. Memory probles might arrise.`,
          );
        }
        resolve();
      });
    });
  }
}
