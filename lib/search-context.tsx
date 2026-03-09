"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface SearchContextValue {
  /** Current search query (debounced by the input, raw here) */
  query: string;
  /** Update the search query */
  setQuery: (q: string) => void;
  /** Clear the search */
  clear: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");

  const clear = useCallback(() => setQuery(""), []);

  return (
    <SearchContext.Provider value={{ query, setQuery, clear }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
