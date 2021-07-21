import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../model/user.js';
import genPassword from '../utils/randomPassword.js';

dotenv.config();

let refreshTokens = [];

export const generateToken = ({ username }) => {
  return jwt.sign(
    { username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' },
  );
};

export const Login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const existUser = await User.findOne({ username });
      if (!existUser) return res.status(400).json({ message: '用戶不存在' });
      
      const isCorrect = await bcrypt.compare(password, existUser.password);
      if (!isCorrect) return res.status(400).json({ message: '密碼錯誤' });
      
      const accessToken = generateToken({ username: existUser.username })
      const refreshToken = jwt.sign(
        { username: existUser.username },
        process.env.REFRESH_TOKEN_SECRET,
      );
      refreshTokens.push(refreshToken);
      console.log('User login, refreshTokens:', refreshTokens);
      return res.status(200).json({ result: existUser, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: '錯誤' });
    }
};
export const GoogleLogin = async (req, res) => {
    const { username, email, photoUrl } = req.body;
    try {
      let existUser = await User.findOne({ email });
      let firstPassword = null;
      if (!existUser) {
        firstPassword = genPassword(10, true, true, false);
        const hashedPassword = await bcrypt.hash(firstPassword, 10);
        existUser = await User.create({
          username,
          password: hashedPassword,
          email,
          photoUrl,
        });
      }
      
      const accessToken = generateToken({ username: existUser.username })
      const refreshToken = jwt.sign(
        { username: existUser.username },
        process.env.REFRESH_TOKEN_SECRET,
      );
      refreshTokens.push(refreshToken);
      console.log('User login, refreshTokens:', refreshTokens);
      return res.status(200).json({ result: existUser, accessToken, refreshToken, firstPassword });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: '錯誤' });
    }
};
export const Register = async (req, res) => {
  const { username, password, email, photoUrl } = req.body;
  try {
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
      photoUrl,
    });
    return res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: '錯誤' });
  }
};
export const Logout = (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
  console.log('User logout, refreshTokens:', refreshTokens);
  return res.sendStatus(204);
};

export const RefreshToken = (req, res) => {
  const { accessToken, refreshToken } = req.body;

  if (!refreshToken) return res.status(400).json({ message: 'Refresh token is null!' });
  if (!refreshTokens.includes(refreshToken)) return res.status(400).json({ message: 'Refresh token is not in list!' });
  
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (error) => {
    if (error) {
      try {
        const { username } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const existUser = await User.findOne({ username });

        const newAccessToken = generateToken({ username });
        return res.status(200).json({ 
          result: existUser, 
          accessToken: 
          newAccessToken, 
          refreshToken, 
          message: 'AccessToken refreshed!' 
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ message: '錯誤' });
      }
    } else {
      return res.status(200).json({ message: 'AccessToken still available' });
    }
  });
};