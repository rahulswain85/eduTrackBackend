import jwt from 'jsonwebtoken';
import { Student } from "../models/users/studentModel.js";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const studentRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(req.body);
    

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    const existedStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existedStudent) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const student = await Student.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const createdStudent = await Student.findById(student._id).select('-password -refreshToken');
    if (!createdStudent) {
      return res.status(500).json({ success: false, message: 'Failed to register' });
    }

    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    res.status(201)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json({
        success: true,
        message: 'Registered successfully',
        user: {
          _id: createdStudent._id,
          name: createdStudent.name,
          email: createdStudent.email,
        },
        accessToken,
        refreshToken,
        expiresIn: '1d',
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);
    

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      console.log("Invalid email or password");
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await student.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    const loggedStudent = await Student.findById(student._id).select('-password -refreshToken');

    res.status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json({
        success: true,
        message: 'Logged in successfully',
        user: {
          _id: loggedStudent._id,
          name: loggedStudent.name,
          email: loggedStudent.email,
        },
        accessToken,
        refreshToken,
        expiresIn: '1d',
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

export const studentLogout = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    res.status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json({
        success: true,
        message: 'Logged out successfully',
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Logout failed',
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const student = await Student.findById(decoded._id);
    if (!student || student.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const accessToken = student.generateAccessToken();
    const newRefreshToken = student.generateRefreshToken();

    student.refreshToken = newRefreshToken;
    await student.save({ validateBeforeSave: false });

    res.status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: '1d',
      });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};
