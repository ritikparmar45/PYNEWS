import { useEffect, useState } from 'react';
import api from '../api/axios';
import NewsCard from '../components/NewsCard';
import { Loader2 } from 'lucide-react';

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
    // Note: The backend route is DELETE /api/favorites/:id where :id is the favorite document ID
    // We pass favorite user-assoc doc ID here, which is the `item._id` in the map below.
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

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Starred AI News</h1>
        <p className="mt-2 text-sm text-gray-600">Your curated collection of important articles for future reference and sharing.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">You haven't favored any news yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => {
            // Check if population failed or news was deleted
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
