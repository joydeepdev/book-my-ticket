import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/Api-response.js';
import ApiError from '../utils/Api-error.js';
import { createUser, findUserByEmail } from '../models/auth.model.js';

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
