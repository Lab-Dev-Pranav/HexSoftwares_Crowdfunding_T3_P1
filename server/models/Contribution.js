import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
   transactionId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contribution', contributionSchema);
