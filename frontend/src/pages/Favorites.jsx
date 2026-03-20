import { useEffect, useState } from 'react';
import api from '../api/axios';
import NewsCard from '../components/NewsCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/favorites');
      setFavorites(res.data);
    } catch (error) {
      console.error(error);
      showToast('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      showToast('Removed from favorites');
      setFavorites(favorites.filter(f => f._id !== favoriteId));
    } catch (error) {
      showToast('Error removing favorite');
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

      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-black text-blue-900">My Saved News</h1>
        <p className="text-gray-600 mt-1">Articles you have saved to read later.</p>
      </div>

      {loading ? (
        <div className="text-center p-10 font-bold text-gray-500">
          Loading your favorite news... please wait.
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-yellow-100 p-5 border border-yellow-300 text-center rounded">
          <strong>No favorites found.</strong> Go to the Home page to save some news!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((item) => {
            if (!item.newsId) return null;
            return (
              <NewsCard 
                key={item._id} 
                article={item.newsId} 
                onFavorite={() => {}}
                onBroadcast={handleBroadcast}
                isFavoriteView={true}
                onRemoveFavorite={() => handleRemoveFavorite(item._id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
