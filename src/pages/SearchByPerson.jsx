import { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import PhotoCard from '../components/PhotoCard';

function SearchByPerson() {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/photos/by-person?name=${encodeURIComponent(searchTerm)}`
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
        <h1 className="text-3xl font-bold text-slate-100">Zoek op Persoon</h1>
        <p className="text-slate-400">Voer een naam in om foto's te vinden</p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900/30 border-2 border-slate-700 rounded-3xl p-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Bijv. Riek Wanders, Jan Derksen..."
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={handleSearch}
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

export default SearchByPerson;
