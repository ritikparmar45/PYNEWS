import Parser from 'rss-parser';
import { isDuplicateNews } from './deduplicationService.js';
import News from '../models/News.js';

const parser = new Parser();

const FEEDS = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml' }, // Requires a third-party proxy in prod usually, dummy path for MVP
  { name: 'Google AI Blog', url: 'http://googleaiblog.blogspot.com/atom.xml' },
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'arXiv (AI)', url: 'http://export.arxiv.org/rss/cs.AI' },
  { name: 'Wired (AI)', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { name: 'Reddit ML', url: 'https://www.reddit.com/r/MachineLearning.rss' },
  { name: 'PapersWithCode', url: 'https://paperswithcode.com/rss' }, // Example fallback if not exist
  { name: 'YouTube AI (Two Minute Papers)', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg' },
  { name: 'Stability AI Blog', url: 'https://stability.ai/news?format=rss' }
];

export const fetchAndStoreNews = async () => {
  let newArticlesCount = 0;
  
  for (const feed of FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      
      // Limit to 10 articles per feed to avoid overloading the DB
      const items = feedData.items.slice(0, 10);
      
      for (const item of items) {
        const title = item.title || 'No Title';
        const url = item.link || item.guid;
        const summary = item.contentSnippet || item.content || '';
        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

        if (!url) continue;

        const isDuplicate = await isDuplicateNews(url, title);
        
        if (!isDuplicate) {
          await News.create({
            title,
            summary,
            source: feed.name,
            url,
            publishedAt,
            isDuplicate: false, // We don't insert duplicate values in MVP, just omit them
          });
          newArticlesCount++;
        }
      }
    } catch (error) {
      console.error(`Error fetching feed ${feed.name}:`, error.message);
    }
  }
  
  return { message: `Ingestion completed. Added ${newArticlesCount} new articles.` };
};
