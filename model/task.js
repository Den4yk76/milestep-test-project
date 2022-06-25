import pkg from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const { Schema, SchemaTypes, model } = pkg;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    isDone: {
      type: Boolean,
    },
    priority: {
      type: Number,
      required: [true, 'Priority is required'],
    },
    dueDate: {
      type: String,
      required: [true, 'dueDate is required'],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  },
);

const Task = model('task', taskSchema);

export default Task;
