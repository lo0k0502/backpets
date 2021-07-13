import User from '../model/user.js';
import bcrypt from 'bcryptjs';

export const Login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const User = await User.findOne({ username });
      if (!User) return res.status(400).json({ message: '用戶不存在' });
      
      const isCorrect = await bcrypt.compare(password, User.password);
      if (!isCorrect) return res.status(400).json({ message: '密碼錯誤' });
      
      const token = jwt.sign(
        { username: User.username, id: User._id },
        'test',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token, result: User });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: '錯誤' });
    }
};
export const Register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    console.log({ username, password, email });
    console.log(await User.find());
    const existUser = await User.findOne({ username });
    if (existUser)
      return res.status(400).json({ message: '用戶名已被使用!' });
    
    const existEmail = await User.findOne({ email });
    if (existEmail)
      return res.status(400).json({ message: 'Email已被使用!' });
      
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: '錯誤' });
  }
};