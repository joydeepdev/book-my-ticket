import jwt from 'jsonwebtoken';
import ApiError from '../utils/Api-error.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    throw ApiError.unauthorized('Invalid token');
  }
};

export default authMiddleware;
