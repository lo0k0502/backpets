import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    photoUrl: { type: String },
});
  
export default mongoose.model('User', userSchema);