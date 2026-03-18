import Parser from 'rss-parser';
import { isDuplicateNews } from './deduplicationService.js';
import News from '../models/News.js';

const parser = new Parser();

const FEEDS = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'Reddit ML', url: 'https://www.reddit.com/r/MachineLearning.rss' },
  { name: 'Hacker News AI', url: 'https://hnrss.org/newest?q=AI' },
  // Optional/Fallback feeds (Some may block automated requests, keeping reliable ones)
  { name: 'Google AI Blog', url: 'http://googleaiblog.blogspot.com/atom.xml' }
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
