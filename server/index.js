import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import auth from './routes/auth.js';
import user from './routes/user.js';
import avatar from './routes/avatar.js';

import('dotenv').then(module => module.config());

const port = process.env.PORT || 8001;

const app = express();
app.use(express.json());
app.use(cors());

try {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    console.log('db connected');

    app.use('/auth', auth);
    app.use('/user', user);
    app.use('/avatar', avatar);

    app.use('*', (req, res) => res.status(404).json({ error: 'not found' }));

    app.listen(port, () => console.log(`server is running on port ${port}`));
} catch (error) {
    console.log(error);
    console.log('Cannot connect to db');
    process.exit(1);
}

mongoose.connection.on('connected', () => console.log('db connected'));