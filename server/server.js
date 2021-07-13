import express from 'express';
import cors from 'cors';

import auth from './routes/auth.js';
import user from './routes/user.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', auth);
app.use('/user', user);
app.use('*', (req, res) => res.status(404).json({ error: "not found" }));

export default app;