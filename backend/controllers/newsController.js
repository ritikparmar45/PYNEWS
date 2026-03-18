import News from '../models/News.js';
import { fetchAndStoreNews } from '../services/ingestionService.js';

export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 }).limit(50);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news from database' });
  }
};

export const fetchNews = async (req, res) => {
  try {
    const result = await fetchAndStoreNews();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error triggering news ingestion' });
  }
};
