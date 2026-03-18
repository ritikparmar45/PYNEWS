import mongoose from 'mongoose';

const broadcastLogSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true,
  },
  platform: {
    type: String, // email, linkedin, whatsapp
    required: true,
  },
  status: {
    type: String,
    enum: ['Success', 'Failed'],
    default: 'Success',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const BroadcastLog = mongoose.model('BroadcastLog', broadcastLogSchema);

export default BroadcastLog;
