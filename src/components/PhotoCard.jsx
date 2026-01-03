import { useState } from 'react';
import { Calendar, Image, Users, ChevronDown, ChevronUp } from 'lucide-react';

function PhotoCard({ photo }) {
  const [showAllPeople, setShowAllPeople] = useState(false);
  const INITIAL_PEOPLE_COUNT = 5;

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDateDisplay = () => {
    if (photo.yearOnly) {
      return `${photo.yearOnly}`;
    }
    if (photo.dateStart && photo.dateEnd && photo.dateStart !== photo.dateEnd) {
      return `${formatDate(photo.dateStart)} - ${formatDate(photo.dateEnd)}`;
    }
    if (photo.dateStart) {
      return formatDate(photo.dateStart);
    }
    return 'Datum onbekend';
  };

  const displayedPeople = showAllPeople 
    ? photo.people 
    : photo.people?.slice(0, INITIAL_PEOPLE_COUNT);
  
  const hasMorePeople = photo.people && photo.people.length > INITIAL_PEOPLE_COUNT;

  return (
    <div className="group bg-slate-900/30 hover:bg-slate-900/50 border-2 border-slate-700 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300">
      {/* Photo Placeholder */}
      <div className="h-40 bg-slate-800/50 flex items-center justify-center border-b border-slate-700">
        <div className="text-center">
          <Image className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-mono text-slate-500">
            {photo.volgnr}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Subject */}
        <h3 className="text-base font-semibold text-slate-100 line-clamp-2 min-h-[3rem]">
          {photo.onderwerp || 'Zonder titel'}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Calendar size={16} className="flex-shrink-0" />
          <span>{getDateDisplay()}</span>
        </div>

        {/* People */}
        {photo.people && photo.people.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Users size={16} className="flex-shrink-0" />
              <span className="font-medium">
                {photo.people.length} {photo.people.length === 1 ? 'persoon' : 'personen'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {displayedPeople.map((person) => (
                <span
                  key={person.personId}
                  className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-md font-medium border border-indigo-500/30"
                >
                  {person.primaryName}
                </span>
              ))}
            </div>
            
            {/* Show More/Less Button */}
            {hasMorePeople && (
              <button
                onClick={() => setShowAllPeople(!showAllPeople)}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-2"
              >
                {showAllPeople ? (
                  <>
                    <ChevronUp size={14} />
                    Toon minder
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Toon {photo.people.length - INITIAL_PEOPLE_COUNT} meer
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoCard;
