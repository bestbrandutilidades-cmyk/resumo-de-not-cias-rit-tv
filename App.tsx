import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import NewsCard from './components/NewsCard';
import LoadingSpinner from './components/LoadingSpinner';
import SearchHistory from './components/SearchHistory';
import { fetchNews } from './services/geminiService';
import type { SearchResult } from './types';
import { LinkIcon } from './components/IconComponents';
import Logo from './components/Logo';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('');

  // Verifica se a chave da API existe para exibir o modal de instruções se necessário
  // NOTA: A variável de ambiente do Vercel é definida no momento da compilação.
  // Se a chave for adicionada, um "redeploy" é necessário para que ela seja incluída.
  const apiKeyExists = !!process.env.API_KEY;

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('newsSearchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse search history from localStorage", e);
      setSearchHistory([]);
    }
  }, []);

  const updateSearchHistory = (topic: string) => {
    const newHistory = [topic, ...searchHistory.filter(item => item.toLowerCase() !== topic.toLowerCase())].slice(0, 5);
    setSearchHistory(newHistory);
    try {
      localStorage.setItem('newsSearchHistory', JSON.stringify(newHistory));
      // FIX: Added curly braces to the catch block to fix syntax error.
    } catch (e) {
      console.error("Failed to save search history to localStorage", e);
    }
  };

  const handleSearch = async (topic: string) => {
    if (!topic || isLoading || !apiKeyExists) return;

    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    setCurrentTopic(topic);
    updateSearchHistory(topic);

    try {
      const result = await fetchNews(topic);
      setSearchResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('newsSearchHistory');
    } catch (e) {
      console.error("Failed to clear search history in localStorage", e);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      
      {!apiKeyExists && <ApiKeyModal />}

      <header className="bg-white dark:bg-gray-800 shadow-md py-6">
        <div className="container mx-auto px-4 text-center">
          <Logo className="w-28 h-auto mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            RESUMO DE NOTÍCIAS - RIT TV
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            As últimas notícias do Brasil e do mundo, resumidas para você.
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <section className="mb-10">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          <SearchHistory 
            history={searchHistory}
            onSearch={handleSearch}
            onClear={handleClearHistory}
            isLoading={isLoading}
          />
        </section>
        
        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="text-center p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
            <p className="font-semibold">Erro!</p>
            <p>{error}</p>
          </div>
        )}

        {searchResult && !isLoading && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">
              Últimas notícias sobre "{currentTopic}"
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {searchResult.articles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
             {searchResult.sources && searchResult.sources.length > 0 && (
              <div className="mt-12 p-6 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Fontes utilizadas na pesquisa
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {searchResult.sources.map((source, index) =>
                    // FIX: Added a check for source.web.uri to prevent runtime errors with optional properties.
                    source.web && source.web.uri ? (
                      <li key={index}>
                        <a
                          href={source.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          title={source.web.uri}
                        >
                          {source.web.title || new URL(source.web.uri).hostname}
                        </a>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {!isLoading && !searchResult && !error && apiKeyExists && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-16">
            <h2 className="text-2xl font-semibold">Bem-vindo!</h2>
            <p className="mt-2">Use a barra de pesquisa acima para encontrar as últimas notícias sobre qualquer assunto.</p>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2024 RIT TV. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;