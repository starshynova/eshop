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
      search: createSearchParams({
        term: q.trim(),
        mode: "semantic",
      }).toString(),
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="flex w-full flex-row py-4 px-20 gap-8 z-10 bg-white">
      <div className="w-[50%] p-6">
        <div className="flex items-center mb-4">
          <MagnifyingGlassIcon
            className="w-6 h-6 text-indigo-600 mr-2"
            aria-hidden="true"
          />
          <h2 className="text-lg uppercase">Regular search</h2>
        </div>
        <SearchInputTxt
          placeholder="Regular search..."
          onSearch={handleRegularSearch}
        />
      </div>

      <div className="w-[50%] p-6">
        <div className="flex items-center mb-4">
          <AdjustmentsHorizontalIcon
            className="w-6 h-6 text-indigo-600 mr-2"
            aria-hidden="true"
          />
          <h2 className="text-lg uppercase">Semantic search</h2>
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
