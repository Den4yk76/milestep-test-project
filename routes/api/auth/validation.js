import Joi from 'joi';
import { HttpCode } from '../../../lib/constants.js';

const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

const resendVerifySchema = Joi.object({
  email: Joi.string().email().required(),
});

export const validateSignUp = async (req, res, next) => {
  try {
    await signUpSchema.validateAsync(req.body);
  } catch (err) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: err.message.replace(/"/g, '') });
  }
  next();
};

export const validateLogin = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
  } catch (err) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: err.message.replace(/"/g, '') });
  }
  next();
};

export const validateResendVerifySchema = async (req, res, next) => {
  try {
    await resendVerifySchema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: 'missing required field email' });
  }
  next();
};
