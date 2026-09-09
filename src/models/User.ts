import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  createdAt: Date;
  updatedAt: Date;
  toSafeObject(): {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must not exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never include password in queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password (Mongoose 8+: async hook — no `next` callback)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to return safe user object (without password)
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
  };
};

// Create unique index on email
userSchema.index({ email: 1 }, { unique: true });

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', userSchema);

export default User;
