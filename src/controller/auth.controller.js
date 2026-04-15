import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/Api-response.js';
import ApiError from '../utils/Api-error.js';
import { createUser, findUserByEmail } from '../models/auth.model.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) return ApiError.badRequest('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(username, email, hashedPassword);
  ApiResponse.created(res, 'user created successfully', user);
};

