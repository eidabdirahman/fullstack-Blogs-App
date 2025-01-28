import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../Config/Config.js';

const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Log the error for debugging
    return res.status(401).json({ message: 'Invalid token', error });
  }
};

export default authenticate;
