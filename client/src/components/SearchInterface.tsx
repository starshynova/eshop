import React from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, createSearchParams } from "react-router-dom";
import SearchInputTxt from "./SearchInputTxt";

interface Props {
  show: boolean;
  onClose: () => void;
}

const SearchInterface: React.FC<Props> = ({ show, onClose }) => {
  const navigate = useNavigate();

  const handleRegularSearch = (q: string) => {
    if (!q.trim()) return;
    navigate({
      pathname: "/search",
      // отправляем имя term (алиас для q на бэкенде) и mode
      search: createSearchParams({
        term: q.trim(),
        mode: "regular",
      }).toString(),
    });

    onClose();
  };

  const handleSemanticSearch = (q: string) => {
    if (!q.trim()) return;
    navigate({
      pathname: "/search",
      // отправляем имя term (алиас для q на бэкенде) и mode
      search: createSearchParams({
        term: q.trim(),
        mode: "semantic",
      }).toString(),
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="flex w-full flex-row py-4 px-20 gap-8 z-10">
      {/* Обычный поиск */}
      <div className="bg-white w-[50%] shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <MagnifyingGlassIcon
            className="w-6 h-6 text-blue-600 mr-2"
            aria-hidden="true"
          />
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
          <AdjustmentsHorizontalIcon
            className="w-6 h-6 text-indigo-600 mr-2"
            aria-hidden="true"
          />
          <h2 className="text-xl font-medium">Semantic search</h2>
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
