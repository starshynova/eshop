// import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
// import SearchInputTxt from './SearchInputTxt';
// import { useSearchQuery } from '../context/SearchQueryContext'; 

// const SearchInterface = () => {
//   const { query, setQuery} = useSearchQuery();

//   const handleRegularSearch = (q: string) => {
//     console.log('Regular search:', q);
//     setQuery(q);
//   };

//   const handleSemanticSearch = (q: string) => {
//     console.log('Semantic search:', q);
//     setQuery(q); // Сохраняем запрос в контекст
//   };

//   return (
//     <div className="p-8 space-y-10">
//       <div className="flex w-full flex-row px-20 gap-8">
//         {/* Обычный поиск */}
//         <div className="bg-white w-[50%] shadow-md rounded-lg p-6">
//           <div className="flex items-center mb-4">
//             <MagnifyingGlassIcon className="w-6 h-6 text-blue-600 mr-2" aria-hidden="true" />
//             <h2 className="text-xl font-medium">Regular search</h2>
//           </div>
//           <SearchInputTxt
//             placeholder="Search..."
//             onSearch={handleRegularSearch}
//           />
//         </div>

//         {/* Семантический поиск */}
//         <div className="bg-white w-[50%] shadow-md rounded-lg p-6">
//           <div className="flex items-center mb-4">
//             <AdjustmentsHorizontalIcon className="w-6 h-6 text-indigo-600 mr-2" aria-hidden="true" />
//             <h2 className="text-xl font-medium">Seamntic search</h2>
//           </div>
//           <SearchInputTxt
//             placeholder="Semantic search..."
//             onSearch={handleSemanticSearch}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SearchInterface;




import React from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import SearchInputTxt from './SearchInputTxt';
import { useSearchQuery } from '../context/SearchQueryContext';

// Принимаем пропс для отображения формы
interface SearchInterfaceProps {
  show: boolean;
  onClose: () => void;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ show }) => {
  const { setQuery } = useSearchQuery();

  const handleRegularSearch = (q: string) => {
    setQuery(q);
    // onClose();
  };

  const handleSemanticSearch = (q: string) => {
    setQuery(q);
    // onClose();
  };

  if (!show) return null;

  return (
    // <div className="p-8 space-y-10">
      <div className="flex w-full flex-row py-4 px-20 gap-8 z-10">
        {/* Обычный поиск */}
        <div className="bg-white w-[50%] shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MagnifyingGlassIcon className="w-6 h-6 text-blue-600 mr-2" aria-hidden="true" />
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
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-indigo-600 mr-2" aria-hidden="true" />
            <h2 className="text-xl font-medium">Seamntic search</h2>
          </div>
          <SearchInputTxt
            placeholder="Semantic search..."
            onSearch={handleSemanticSearch}
          />
        </div>
      </div>
    // </div>
  );
};

export default SearchInterface;


// import React from 'react';
// import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
// import SearchInputTxt from './SearchInputTxt';
// import { useSearchQuery } from '../context/SearchQueryContext';

// // Принимаем пропс для отображения формы
// interface SearchInterfaceProps {
//   show: boolean;
//   onClose: () => void;
// }

// const SearchInterface: React.FC<SearchInterfaceProps> = ({ show }) => {
//   const { setQuery } = useSearchQuery();

//   const handleRegularSearch = (q: string) => {
//     setQuery(q);
//     // onClose();
//   };

//   const handleSemanticSearch = (q: string) => {
//     setQuery(q);
//     // onClose();
//   };

//   // Overlay panel fixed below header (height 80px)
//   return (
//     <div
//       className={`fixed inset-x-0 top-[80px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
//         ${show ? 'translate-y-0' : '-translate-y-full'}`}
//       style={{ minHeight: '200px' }}
//     >
//       <div className="max-w-3xl mx-auto p-6">
//         <h2 className="text-lg font-medium mb-4">Выберите тип поиска</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div
//             className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
//             onClick={() => handleRegularSearch('')}
//           >
//             <MagnifyingGlassIcon className="w-5 h-5 text-blue-600 mr-2" aria-hidden="true" />
//             <span>Regular search</span>
//           </div>

//           <div
//             className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
//             onClick={() => handleSemanticSearch('')}
//           >
//             <AdjustmentsHorizontalIcon className="w-5 h-5 text-indigo-600 mr-2" aria-hidden="true" />
//             <span>Semantic search</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchInterface;
