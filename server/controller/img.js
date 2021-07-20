import { createReadStream } from 'fs';
import mongoose from 'mongoose';
let gfs;

const conn = mongoose.connection;
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'avatar' });
});

export const upload = (req, res) => {
    setTimeout(() => {
        if (!req.file) return res.status(400).json({ message: 'No file selected' });
        if (req.file.mimetype !== 'image/jpeg'
            && req.file.mimetype !== 'image/png') 
            return res.status(400).json({ message: 'Not an image!!' });
        const imgUrl = `http://localhost:5001/file/${req.file.filename}`;
        return res.status(200).json({ imgUrl });
    }, 500);
};
export const get = async (req, res) => {
    try {
        const file = (await gfs.find({ filename: req.params.filename }).toArray())[0];
        const readStream = gfs.openDownloadStreamByName(file.filename);
        readStream.pipe(res);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Getting error' });
    }
};

export const del = async (req, res) => {
    try {
        const file = (await gfs.find({ filename: req.params.filename }).toArray())[0];
        if (!file) return res.status(400).json({ message: 'No such file' });
        await gfs.delete(file._id);
        res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Deleting error' });
    }
};