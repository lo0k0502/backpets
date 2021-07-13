import express from 'express';
import cors from 'cors';

import auth from './routes/auth.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', auth);

export default app;