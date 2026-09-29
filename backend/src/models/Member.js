import mongoose from 'mongoose';
import { getTier } from '../utils/tier.js';

const memberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      unique: true,
      default: () => `FF${Math.floor(100000 + Math.random() * 900000)}`,
    },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    points: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false, id: false, toJSON: { virtuals: true } }
);

memberSchema.virtual('tier').get(function () {
  return getTier(this.points);
});

export default mongoose.model('Member', memberSchema);
