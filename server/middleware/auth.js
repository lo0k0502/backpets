import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  console.log('AccessToken verifying...');
  
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    console.log('AccessToken verified!')
    next();
  });
};
