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

        
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '錯誤' });
    }
};
export const updateUser = async (req, res) => {
    // const { username, password } = req.body;
    try {
        console.log(req);
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

        User.deleteOne({ username }).then(() => {
            return res.status(200).json({ success: true });
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '錯誤' });
    }
};