import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import moment from 'moment';

const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/photos',
    file: (req, file) => {
        return { 
            bucketName: 'avatar',
            filename:`${moment().valueOf()}-${file.originalname}`, 
        };
    },
});

const uploadimg = multer({ storage }).single('file');

export default uploadimg;