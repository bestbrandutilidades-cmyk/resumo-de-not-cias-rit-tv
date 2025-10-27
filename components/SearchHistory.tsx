import React from 'react';
import { HistoryIcon, TrashIcon } from './IconComponents';

interface SearchHistoryProps {
  history: string[];
  onSearch: (topic: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSearch, onClear, isLoading }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center">
          <HistoryIcon className="w-4 h-4 mr-2" />
          Buscas Recentes
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-500 dark:hover:text-red-400 flex items-center transition-colors disabled:opacity-50"
          aria-label="Limpar histórico"
          disabled={isLoading}
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Limpar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => onSearch(item)}
            disabled={isLoading}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;