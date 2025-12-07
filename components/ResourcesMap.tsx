import React, { useState } from 'react';
import { Search, MapPin, Navigation2, Loader2 } from 'lucide-react';
import * as GeminiService from '../services/geminiService';

export const ResourcesMap: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Fresno, CA');
  const [results, setResults] = useState<{text: string, places: any[]}>({ text: '', places: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    const data = await GeminiService.findLocalResources(query, location);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="h-full pb-24">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Find Local Resources</h2>
        <p className="text-slate-500 text-sm mb-6">
          Powered by Gemini & Google Maps Grounding. Find suppliers, experts, and more.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Looking For</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Irrigation Supplies, Agronomist"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Near Location</label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State or Zip"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search Maps'}
          </button>
        </form>
      </div>

      {/* Results Area */}
      {(results.text || results.places.length > 0) && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
          {results.text && (
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
               <p className="text-slate-700 text-sm">{results.text}</p>
             </div>
          )}

          {results.places.length > 0 && (
            <div className="grid gap-3">
              {results.places.map((place, idx) => {
                  // Maps grounding chunk structure varies. We try to extract best effort data.
                  // Typically groundingChunks for maps have a 'web' key or direct map data properties.
                  // We treat 'place' as the object from groundingChunks.
                  // The prompt output text often contains the readable list, but the chunks contain the metadata.
                  const title = place.title || "Unknown Location";
                  const uri = place.uri || "#";
                  
                  return (
                    <a 
                      key={idx} 
                      href={uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block bg-white p-4 rounded-xl border border-slate-100 hover:border-lime-500 transition-all group shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-slate-800 group-hover:text-lime-600 transition-colors">{title}</h4>
                          <p className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">{uri}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-full group-hover:bg-lime-50 transition-colors">
                          <Navigation2 className="w-5 h-5 text-slate-400 group-hover:text-lime-600" />
                        </div>
                      </div>
                    </a>
                  )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};