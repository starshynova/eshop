import React from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import SearchInputTxt from './SearchInputTxt';
import { useSearchQuery } from '../context/SearchQueryContext';


const SearchInterface: React.FC<{show: boolean}> = ({ show }) => {
  const { setQuery } = useSearchQuery();

  const handleRegularSearch = (q: string) => {
    setQuery(q);
  };

  const handleSemanticSearch = (q: string) => {
    setQuery(q);
  };

  if (!show) return null;

  return (
      <div className="flex w-full flex-row py-4 px-20 gap-8 z-10">
        {/* Обычный поиск */}
        <div className="bg-white w-[50%] shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MagnifyingGlassIcon className="w-6 h-6 text-blue-600 mr-2" aria-hidden="true" />
            <h2 className="text-xl font-medium">Regular search</h2>
          </div>
          <SearchInputTxt
            placeholder="Search..."
            onSearch={handleRegularSearch}
          />
        </div>

        {/* Семантический поиск */}
        <div className="bg-white w-[50%] shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-indigo-600 mr-2" aria-hidden="true" />
            <h2 className="text-xl font-medium">Seamntic search</h2>
          </div>
          <SearchInputTxt
            placeholder="Semantic search..."
            onSearch={handleSemanticSearch}
          />
        </div>
      </div>
  );
};

export default SearchInterface;

