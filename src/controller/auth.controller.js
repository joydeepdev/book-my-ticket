import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/Api-response.js';
import ApiError from '../utils/Api-error.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../models/auth.model.js';
import pool from '../config/db.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) throw ApiError.badRequest('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(username, email, hashedPassword);
  ApiResponse.created(res, 'user created successfully', user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  //checking user
  const user = await findUserByEmail(email);
  if (!user) throw ApiError.badRequest('Invalid credentials');

  //checking password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw ApiError.badRequest('Invalid credentials');

  //generate access token
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: '15m' },
  );

  //generate refresh token
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: '7d' },
  );
  // Save refresh token in DB
  await pool.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [
    refreshToken,
    user.id,
  ]);

  // 🍪 Send refresh token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  //send access token
  ApiResponse.ok(res, 'logged in succssfully', {
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);

  const user = await findUserById(decoded.id);

  if (!user || user.refresh_token !== token) {
    throw ApiError.forbidden('Invalid refresh token');
  }

  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: '15m' },
  );

  res.json({ accessToken: newAccessToken });
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const decoded = jwt.decode(token);
    if (decoded?.id) {
      await pool.query(`UPDATE users SET refresh_token = NULL WHERE id = $1`, [
        decoded.id,
      ]);
    }
  }

  res.clearCookie('refreshToken');

  res.json({ message: 'Logged out successfully' });
};
