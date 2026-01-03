import { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import PhotoCard from '../components/PhotoCard';

function SearchByEvent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const popularEvents = [
    'Sinterklaas',
    'Vierdaagse',
    'Vakantie',
    'Carnaval',
    'Kerstmis',
    'Pasen',
    'Trouwerij',
    'Communie',
    'Vormsel'
  ];

  const handleSearch = async (keyword = searchTerm) => {
    if (!keyword.trim()) return;

    setLoading(true);
    setSearched(true);
    setSearchTerm(keyword);

    try {
      const response = await fetch(
        `http://localhost:8080/api/photos/by-event?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-100">Zoek op Event</h1>
        <p className="text-slate-400">Vind foto's van specifieke evenementen</p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-slate-900/30 border-2 border-slate-700 rounded-3xl p-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Bijv. Sinterklaas, Vierdaagse..."
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !searchTerm.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Zoeken...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Zoeken
                </>
              )}
            </button>
          </div>
        </div>

        {/* Popular Events */}
        <div className="bg-slate-900/30 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Populaire events:</h3>
          <div className="flex flex-wrap gap-2">
            {popularEvents.map((event) => (
              <button
                key={event}
                onClick={() => handleSearch(event)}
                className="px-4 py-2 bg-slate-800/50 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all"
              >
                {event}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && !loading && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-100">
            {photos.length === 0 ? 'Geen foto\'s gevonden' : `${photos.length} foto${photos.length !== 1 ? '\'s' : ''} gevonden`}
          </h2>

          {photos.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <PhotoCard key={photo.photoId} photo={photo} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchByEvent;
