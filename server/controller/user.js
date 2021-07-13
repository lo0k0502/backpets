import User from '../model/user.js';
import bcrypt from 'bcryptjs';

export const fetchAllUsers = async (req, res) => {
    const result = await User.find();
    return res.status(200).json({ result });
};
export const deleteUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log(username, password);
        const existUser = await User.findOne({ username });
        if (!existUser) return res.status(400).json({ message: '用戶不存在' });
        console.log(await User.find());
        const isCorrect = await bcrypt.compare(password, existUser.password);
        if (!isCorrect) return res.status(400).json({ message: '密碼錯誤' });

        await User.deleteOne({ username });
        console.log(await User.find());
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '錯誤' });
    }
};