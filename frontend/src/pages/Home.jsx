import { useEffect, useState } from 'react';
import api from '../api/axios';
import NewsCard from '../components/NewsCard';
import { RefreshCw, Loader2 } from 'lucide-react';

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
      showToast('Error syncing new articles');
    } finally {
      setFetching(false);
    }
  };

  const handleFavorite = async (article) => {
    try {
      await api.post('/favorites', { newsId: article._id });
      showToast('Added to favorites!');
    } catch (error) {
      if (error.response?.data?.message === 'News is already in favorites') {
        showToast('Already in favorites');
      } else {
        showToast('Error adding favorite');
      }
    }
  };

  const handleBroadcast = async (newsId, platform) => {
    try {
      await api.post('/broadcast', { newsId, platform });
      showToast(`Broadcasted to ${platform} successfully!`);
    } catch (error) {
      showToast('Broadcast failed');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Latest AI News</h1>
          <p className="mt-2 text-sm text-gray-600">Discover the most recent developments in Artificial Intelligence.</p>
        </div>
        
        <button
          onClick={handleFetchLatest}
          disabled={fetching}
          className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {fetching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          {fetching ? 'Syncing...' : 'Fetch Latest News'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No news found. Click "Fetch Latest News" to populate the dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
