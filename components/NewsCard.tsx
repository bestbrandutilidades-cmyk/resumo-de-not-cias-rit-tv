import React from 'react';
import type { Article } from '../types';
import { LinkIcon } from './IconComponents';

interface NewsCardProps {
  article: Article;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{article.titulo}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{article.resumo}</p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Ler matéria completa
        </a>
      </div>
    </div>
  );
};

export default NewsCard;