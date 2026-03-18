import News from '../models/News.js';

export const isDuplicateNews = async (url, title) => {
  try {
    // Check for exact URL match
    const existingUrl = await News.findOne({ url });
    if (existingUrl) return true;

    // Check for exact title match (case insensitive)
    const existingTitle = await News.findOne({ 
      title: { $regex: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
    });
    if (existingTitle) return true;

    return false;
  } catch (error) {
    console.error('Error in deduplication:', error);
    return false; // Decide later if fail-safe is true or false
  }
};
