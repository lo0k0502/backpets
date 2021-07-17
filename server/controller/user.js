import User from '../model/user.js';
import bcrypt from 'bcryptjs';

export const fetchUserByEmail = async (req, res) => {
    const { email } = req.body;
    const existUser = await User.findOne({ email });
    return res.status(200).json({ result: existUser });
};
export const fetchAllUsers = async (req, res) => {
    const result = await User.find();
    return res.status(200).json({ result });
};
export const updateUserPassword = async (req, res) => {
    const { username, password, newPassword } = req.body;
    
    try {
        const existUser = await User.findOne({ username });
        if (!existUser) return res.status(400).json({ message: '用戶不存在' });
        
        const isCorrect = await bcrypt.compare(password, existUser.password);
        if (!isCorrect) return res.status(400).json({ message: '密碼錯誤' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await User.findOneAndUpdate({ username }, { password: hashedPassword });
        return res.status(200).json({ result });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '錯誤' });
    }
};
export const updateUserProfile = async (req, res) => {
    const { photoUrl, username, newUsername, email } = req.body;
    try {
        console.log(photoUrl, username, newUsername, email);
        const existUser = await User.findOne({ username });
        if (!existUser) return res.status(400).json({ message: '用戶不存在' });

        const usedUser = await User.findOne({ username: newUsername });
        if (usedUser) return res.status(400).json({ message: '用戶名已被使用!' });

        existUser.photoUrl = photoUrl;
        existUser.username = newUsername;
        existUser.email = email;
        const result = await existUser.save();
        return res.status(200).json({ result });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '錯誤' });
    }
};
export const deleteUser = async (req, res) => {
    const { username } = req.body;
    try {
        const existUser = await User.findOne({ username });
        if (!existUser) return res.status(400).json({ message: '用戶不存在' });

        await User.deleteOne({ username });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '錯誤' });
    }
};