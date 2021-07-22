import { Schema, model } from 'mongoose';

const userSchema = Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    photoUrl: { type: String },
});
  
export default model('User', userSchema);