import mongoose, { Document, Model, Schema, Types } from 'mongoose';

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'] as const;
const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Social Media',
  'Email Campaign',
  'Cold Call',
  'Event',
  'Partner',
  'Other',
] as const;

export interface ILead extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: typeof LEAD_STATUSES[number];
  source: typeof LEAD_SOURCES[number];
  createdBy: Types.ObjectId;
  assignedTo: Types.ObjectId | null;
  assignedToUser?: {
    _id: string;
    name: string;
    email: string;
  };
  timeline: Array<{
    date: Date;
    label: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'New',
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: 'Website',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead creator is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    timeline: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        label: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
leadSchema.index({ createdBy: 1, createdAt: -1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ status: 1, createdBy: 1 });

const Lead: Model<ILead> = mongoose.models.Lead ?? mongoose.model<ILead>('Lead', leadSchema);

export default Lead;
