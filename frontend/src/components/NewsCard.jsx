import { useState } from 'react';
import api from '../api/axios';

export default function NewsCard({ article, onFavorite, onBroadcast, isFavoriteView, onRemoveFavorite }) {
  const [aiCaption, setAiCaption] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleBroadcast = (platform) => {
    onBroadcast(article._id, platform);
    // Student style alert
    alert(`Article shared to ${platform}!`);
  };

  const handleGenerateAiCaption = async () => {
    try {
      setGeneratingAi(true);
      const res = await api.post('/ai/generate-caption', { newsId: article._id });
      setAiCaption(res.data.caption);
    } catch (error) {
      alert('Failed to generate AI caption');
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="bg-white border text-left border-gray-300 p-4 mb-4 rounded-md shadow">
      
      <div className="flex justify-between border-b pb-2 mb-2">
        <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 text-sm rounded">
          📁 {article.source}
        </span>
        <span className="text-sm text-gray-500 font-medium">
          📅 {new Date(article.publishedAt).toLocaleDateString()}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-gray-800">
        {article.title}
      </h3>
      
      <p className="text-gray-700 mb-4 text-sm leading-relaxed">
        {article.summary || "No summary provided by the news source. Please click the link to read more."}
      </p>

      {/* AI Box */}
      {aiCaption && (
        <div className="bg-purple-100 p-3 mb-4 rounded border border-purple-300">
          <strong className="text-purple-900 block mb-1">🤖 AI LinkedIn Caption:</strong>
          <p className="text-purple-800 whitespace-pre-line text-sm">{aiCaption}</p>
        </div>
      )}

      {/* Buttons Area */}
      <div className="flex flex-wrap gap-2 mt-2">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="bg-gray-200 text-black px-3 py-1.5 rounded hover:bg-gray-300 text-sm font-medium">
          🔗 Read Article
        </a>
        
        <button onClick={handleGenerateAiCaption} disabled={generatingAi} className="bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 text-sm font-medium">
          {generatingAi ? "⏳ Generating..." : "✨ AI Caption"}
        </button>

        {!isFavoriteView ? (
          <button onClick={() => onFavorite(article)} className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 text-sm font-medium">
            ❤️ Save News
          </button>
        ) : (
          <button onClick={() => onRemoveFavorite(article._id)} className="bg-red-100 text-red-800 border border-red-300 px-3 py-1.5 rounded text-sm font-medium hover:bg-red-200">
            ❌ Remove 
          </button>
        )}
      </div>

      <div className="mt-3 bg-gray-50 p-2 rounded border">
        <span className="text-xs font-bold text-gray-500 mr-2">SHARE TO:</span>
        <div className="inline-flex gap-2">
          <button onClick={() => handleBroadcast('linkedin')} className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">LinkedIn</button>
          <button onClick={() => handleBroadcast('whatsapp')} className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">WhatsApp</button>
          <button onClick={() => handleBroadcast('email')} className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-semibold">Email</button>
        </div>
      </div>

    </div>
  );
}
