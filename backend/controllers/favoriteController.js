import Favorite from '../models/Favorite.js';

export const addFavorite = async (req, res) => {
  try {
    const { newsId } = req.body;
    
    if (!newsId) {
      return res.status(400).json({ message: 'newsId is required' });
    }
    
    // Check if already favorite
    const existing = await Favorite.findOne({ newsId });
    if (existing) {
      return res.status(400).json({ message: 'News is already in favorites' });
    }

    const favorite = await Favorite.create({ newsId });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find().populate('newsId').sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    await Favorite.findByIdAndDelete(id);
    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite' });
  }
};
