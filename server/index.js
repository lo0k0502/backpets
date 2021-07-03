import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './server.js';

dotenv.config();

const port = process.env.PORT || 8001;

mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((err) => {
        console.log(err.stack);
        process.exit(1);
    })
    .then(async (client) => {
        app.listen(port, () => console.log(`server is running on ${port}`));
    });

mongoose.connection.on("connected", () => console.log("db connected"));