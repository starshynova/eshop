import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1) Тип для нашего контекста: строка + setter
interface SearchQueryContextType {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

// 2) Создаём контекст, по умолчанию undefined для отлова ошибок
const SearchQueryContext = createContext<SearchQueryContextType | undefined>(undefined);

type SearchQueryProviderProps = { children: ReactNode };

// 3) Провайдер, который будем оборачивать приложение или определённые разделы
export function SearchQueryProvider({ children }: SearchQueryProviderProps) {
  const [query, setQuery] = useState<string>('');

  return (
    <SearchQueryContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
}

// 4) Кастомный хук для удобного доступа к контексту
export function useSearchQuery(): SearchQueryContextType {
  const context = useContext(SearchQueryContext);
  if (!context) {
    throw new Error('useSearchQuery must be used within SearchQueryProvider');
  }
  return context;
}
