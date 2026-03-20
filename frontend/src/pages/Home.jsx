import { useEffect, useState } from 'react';
import api from '../api/axios';
import NewsCard from '../components/NewsCard';

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [toast, setToast] = useState(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/news');
      setNews(res.data);
    } catch (error) {
      console.error(error);
      showToast('Error loading news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFetchLatest = async () => {
    try {
      setFetching(true);
      const res = await api.post('/news/fetch');
      showToast(res.data.message);
      await loadNews();
    } catch (error) {
      console.error(error);
      showToast('Error fetching news from RSS');
    } finally {
      setFetching(false);
    }
  };

  const handleFavorite = async (article) => {
    try {
      await api.post('/favorites', { newsId: article._id });
      showToast('Successfully added to favorites!');
    } catch (error) {
      if (error.response?.data?.message === 'News is already in favorites') {
        showToast('This is already in your favorites');
      } else {
        showToast('Error adding favorite');
      }
    }
  };

  const handleBroadcast = async (newsId, platform) => {
    try {
      await api.post('/broadcast', { newsId, platform });
      showToast(`Shared to ${platform} successfully!`);
    } catch (error) {
      showToast('Failed to share');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {toast && (
        <div className="bg-green-100 text-green-800 p-3 mb-4 border border-green-300 rounded font-bold">
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-black text-blue-900">Latest AI News Feeds</h1>
          <p className="text-gray-600 mt-1">Get the newest articles about Artificial Intelligence here.</p>
        </div>
        
        <button
          onClick={handleFetchLatest}
          disabled={fetching}
          className="bg-blue-600 text-white px-5 py-2 mt-4 md:mt-0 font-bold rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
        >
          {fetching ? '🔄 Loading news...' : '📥 Fetch Latest News'}
        </button>
      </div>

      {loading ? (
        <div className="text-center p-10 font-bold text-gray-500">
          Loading news from database... please wait.
        </div>
      ) : news.length === 0 ? (
        <div className="bg-yellow-100 p-5 border border-yellow-300 text-center rounded">
          <strong>No news found.</strong> Click "Fetch Latest News" above to load articles.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <NewsCard 
              key={item._id} 
              article={item} 
              onFavorite={handleFavorite}
              onBroadcast={handleBroadcast}
              isFavoriteView={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
