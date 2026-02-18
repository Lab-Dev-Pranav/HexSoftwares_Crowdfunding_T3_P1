import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
   goalAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     category: { type: String },
  status: { type: String, enum: ['active', 'funded', 'expired'], default: 'active' },
  returnPercentage: { type: Number, required: true }, // Promised return percentage
   deadline: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);
