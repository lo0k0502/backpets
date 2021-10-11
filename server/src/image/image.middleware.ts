import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';
import * as moment from 'moment';

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
    gridFsStorage;
    constructor() {
        this.gridFsStorage = new GridFsStorage({
            url: process.env.DB_URI,
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            file: (req, file) => {
                return { filename:`${moment().valueOf()}-${file.originalname}`, bucketName: 'image' };
            },
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return { storage: this.gridFsStorage };
    }
}