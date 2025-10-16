const { model, Schema } = require('mongoose');
const { isEmail } = require('validator');
const {encryptPassword,checkPassword} = require('../bcrypt');

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return isEmail(email);
      },
      message: "Please enter a valid email",
    },
  },
  age: {
    type: Number,
    validate: {
      validator(age) {
        if (age < 0) {
          throw new Error("Age must be a positive number");
        }
        return true;
      },
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },
}, {
  timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await encryptPassword(this.password);
    }
    next();
});

UserSchema.statics.findByEmailAndPasswordForAuth = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isMatch = await checkPassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid login credentials");
  }
  return user;
};

const User = model('User', UserSchema);
module.exports = User;