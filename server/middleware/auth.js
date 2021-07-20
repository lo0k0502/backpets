import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  console.log('AccessToken verifying...');
  
  const accessToken = req.headers.authorization.split(' ')[1];
  if (!accessToken) return res.status(400).json({ message: 'No access token!' });

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(400).json({ message: 'Forbidden!' });
    req.user = user;
    console.log('AccessToken verified!')
    next();
  });
};
