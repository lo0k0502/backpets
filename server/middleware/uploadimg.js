import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import moment from 'moment';
import mongoose from 'mongoose';

const storage = new GridFsStorage({
    url: process.env.DB_URI,
    options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    file: (req, file) => {
        return { filename:`${moment().valueOf()}-${file.originalname}`, bucketName: 'avatar' };
    },
});

const uploadimg = multer({ storage }).single('avatar');

export default uploadimg;