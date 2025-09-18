import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface SearchQueryContextType {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

// create a context, undefined by default, for error handling
const SearchQueryContext = createContext<SearchQueryContextType | undefined>(
  undefined,
);

type SearchQueryProviderProps = { children: ReactNode };

// provider that will wrap the application or specific parts of it
export const SearchQueryProvider = ({ children }: SearchQueryProviderProps) => {
  const [query, setQuery] = useState<string>("");

  return (
    <SearchQueryContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
};

// custom hook for convenient access to context
export function useSearchQuery(): SearchQueryContextType {
  const context = useContext(SearchQueryContext);
  if (!context) {
    throw new Error("useSearchQuery must be used within SearchQueryProvider");
  }
  return context;
}
