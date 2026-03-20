import { useState } from 'react';
import { ExternalLink, Heart, Share2, Sparkles, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function NewsCard({ article, onFavorite, onBroadcast, isFavoriteView, onRemoveFavorite }) {
  const [broadcasting, setBroadcasting] = useState(false);
  const [aiCaption, setAiCaption] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleBroadcast = (platform) => {
    setBroadcasting(true);
    onBroadcast(article._id, platform);
    setTimeout(() => setBroadcasting(false), 500); // UI feel
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
            {article.source}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
          {article.summary || "No summary provided by the source."}
        </p>

        {/* AI Caption Display Area */}
        {aiCaption && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100 text-sm text-purple-900">
            <span className="block font-semibold mb-1 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-purple-600" /> AI Suggested Caption:
            </span>
            <p className="whitespace-pre-line">{aiCaption}</p>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-500"
          >
            Read More <ExternalLink className="ml-1 w-4 h-4" />
          </a>
          
          <div className="flex space-x-2">
            
            <button
              onClick={handleGenerateAiCaption}
              disabled={generatingAi}
              className="p-2 text-gray-400 hover:text-purple-500 transition-colors tooltip disabled:opacity-50"
              title="Generate AI LinkedIn Caption"
            >
              {generatingAi ? <Loader2 className="w-5 h-5 animate-spin text-purple-500" /> : <Sparkles className="w-5 h-5 hover:fill-purple-100" />}
            </button>

            {!isFavoriteView && (
              <button
                onClick={() => onFavorite(article)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors tooltip"
                title="Add to Favorites"
              >
                <Heart className="w-5 h-5" />
              </button>
            )}
            
            {isFavoriteView && (
               <button
                 onClick={() => onRemoveFavorite(article._id)}
                 className="p-2 text-red-500 hover:text-red-600 transition-colors tooltip"
                 title="Remove from Favorites"
               >
                 <Heart className="w-5 h-5 fill-current" />
               </button>
            )}

            <div className="relative group/share">
              <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              
              <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 invisible group-hover/share:visible transition-all z-10 p-1 flex flex-col gap-1">
                <button 
                  onClick={() => handleBroadcast('linkedin')}
                  disabled={broadcasting}
                  className="text-left text-xs px-3 py-2 hover:bg-gray-50 rounded text-gray-700"
                >
                  LinkedIn
                </button>
                <button 
                  onClick={() => handleBroadcast('whatsapp')}
                  disabled={broadcasting}
                  className="text-left text-xs px-3 py-2 hover:bg-gray-50 rounded text-gray-700"
                >
                  WhatsApp
                </button>
                <button 
                  onClick={() => handleBroadcast('email')}
                  disabled={broadcasting}
                  className="text-left text-xs px-3 py-2 hover:bg-gray-50 rounded text-gray-700"
                >
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
