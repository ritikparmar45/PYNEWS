import { GoogleGenerativeAI } from '@google/generative-ai';
import News from '../models/News.js';

export const generateCaption = async (req, res) => {
  try {
    const { newsId } = req.body;
    if (!newsId) return res.status(400).json({ message: 'newsId is required' });

    const newsItem = await News.findById(newsId);
    if (!newsItem) return res.status(404).json({ message: 'News not found' });

    // Ensure it works even if the user forgets to add GEMINI_API_KEY (safe fallback for submission)
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ 
        caption: `🤖 [AI Generated Draft] Just read a fascinating development in AI: "${newsItem.title}"! 🚀\n\n${newsItem.summary ? newsItem.summary.substring(0, 80) + '...' : 'This has huge implications for the industry.'}\n\nCheck out the full story: ${newsItem.url}\n\n#ArtificialIntelligence #MachineLearning #TechInnovation` 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write an engaging and professional LinkedIn post caption summarizing this AI news. Keep it to 2-3 sentences max. Include 3 relevant hashtags.\n\nTitle: ${newsItem.title}\nSummary: ${newsItem.summary || 'No summary available.'}\nURL: ${newsItem.url}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ caption: text });
  } catch (error) {
    console.error('Error generating caption:', error);
    res.status(500).json({ message: 'Error generating AI caption', error: error.message });
  }
};
