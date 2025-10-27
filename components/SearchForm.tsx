import React, { useState } from 'react';
import { SearchIcon } from './IconComponents';

interface SearchFormProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSearch(topic);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="search"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isLoading}
          placeholder="Digite um tópico (ex: 'tecnologia no Brasil')"
          className="block w-full p-4 pl-11 text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 shadow-sm focus:shadow-lg"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2.5 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;