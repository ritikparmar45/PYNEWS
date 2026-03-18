import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  // Normally user auth is fully implemented, but for MVP we mock a generic user or just allow storing purely by newsRef
  // We will make userId optional or default to a dummy context for the MVP
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Make it optional for simple MVP testing without auth
  },
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
