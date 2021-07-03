import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './server.js';

dotenv.config();

const port = process.env.PORT || 8001;

app.listen(port, () => console.log(`server is running on ${port}`));