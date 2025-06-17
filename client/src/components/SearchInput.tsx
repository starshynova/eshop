import React, { useState } from 'react';

type SearchInputProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Search...', onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-[50%] max-w-md mx-auto p-2">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full h-[32px] px-[20px] py-[20px] border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};

export default SearchInput;
