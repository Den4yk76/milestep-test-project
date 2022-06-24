import pkg from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const { Schema, model } = pkg;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      validate(value) {
        const re = /^[a-zA-Z0-9.\-_$@]{3,30}$/;
        return re.test(String(value).trim().toLowerCase());
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).trim().toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    token: {
      type: String,
      default: null,
    },
    confirmationToken: {
      type: String,
      required: [true, 'Verify token is required'],
      default: function () {
        return uuidv4();
      },
    },
    confirmedAt: {
      type: Boolean,
      default: false,
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

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(6);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

export default User;
