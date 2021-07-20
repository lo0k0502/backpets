import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import moment from 'moment';

const storage = new GridFsStorage({
    url: process.env.DB_URI,
    file: (req, file) => {
        return { filename:`${moment().valueOf()}-${file.originalname}` };
    },
    root: 'avatar',
});

const uploadimg = multer({ storage }).single('avatar');

export default uploadimg;