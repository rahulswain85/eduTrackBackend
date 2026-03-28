import jwt from 'jsonwebtoken';
import { Student } from '../models/users/studentModel.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const student = await Student.findById(decoded._id).select('-password -refreshToken');
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid access token' });
    }

    req.user = student;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid access token' });
  }
};
