import Joi from 'joi';
import pkg from 'mongoose';
import { HttpCode } from '../../../lib/constants.js';

const { Types } = pkg;

const createSchema = Joi.object({
  title: Joi.string().min(1).max(30).trim().required(),
  description: Joi.string().min(1).max(255).trim().required(),
  isDone: Joi.bool().optional(),
  priority: Joi.number().required(),
  dueDate: Joi.string().min(1).trim().required(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(1).max(30).trim().optional(),
  description: Joi.string().min(1).max(255).trim().optional(),
  priority: Joi.number().optional(),
  dueDate: Joi.string().min(1).trim().optional(),
});

const markIsDoneSchema = Joi.object({
  isDone: Joi.bool().optional(),
});

const unmarkIsDoneSchema = Joi.object({
  isDone: Joi.bool().optional(),
});

export const validateCreate = async (req, res, next) => {
  try {
    await createSchema.validateAsync(req.body);
  } catch (err) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: `Field ${err.message.replace(/"/g, '')}` });
  }
  next();
};

export const validateUpdate = async (req, res, next) => {
  try {
    await updateSchema.validateAsync(req.body);
  } catch (err) {
    const [{ type }] = err.details;
    if (type === 'object.missing') {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: 'missing fields' });
    }
    return res.status(HttpCode.BAD_REQUEST).json({ message: err.message });
  }
  next();
};

export const validateMarkIsDone = async (req, res, next) => {
  try {
    await markIsDoneSchema.validateAsync(req.body);
  } catch (err) {
    const [{ type }] = err.details;
    if (type === 'object.missing') {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: 'missing field isDone' });
    }
    return res.status(HttpCode.BAD_REQUEST).json({ message: err.message });
  }
  next();
};

export const validateUnMarkIsDone = async (req, res, next) => {
  try {
    await unmarkIsDoneSchema.validateAsync(req.body);
  } catch (err) {
    const [{ type }] = err.details;
    if (type === 'object.missing') {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: 'missing field isDone' });
    }
    return res.status(HttpCode.BAD_REQUEST).json({ message: err.message });
  }
  next();
};

export const validateId = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: 'Invalid ObjectId' });
  }
  next();
};
