import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import SearchInputTxt from './SearchInputTxt'

export default function SearchSlideInline() {
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = (query: string) => {
    console.log('Ищем:', query)
    // ваша логика поиска
  }

  return (
    <div className="flex w-full items-center justify-end gap-2">
      {/* Обёртка для поля поиска: flex-1 займёт всё место после кнопки */}
      <div
        className={`
          flex-1 overflow-hidden 
          transition-[max-width,opacity] duration-300 ease-in-out
          ${showSearch 
            ? 'max-w-full opacity-100' 
            : 'max-w-0 opacity-0'}
        `}
      >
        {/* Сам инпут подгоняется под ширину контейнера */}
        <SearchInputTxt
          placeholder="Search..."
          onSearch={query => {
            handleSearch(query)
            setShowSearch(false)
          }}
        />
      </div>

      {/* Кнопка-иконка */}
      <button
        className={`
          flex-none w-10 h-10 flex items-center justify-center 
          rounded-full bg-white hover:bg-gray-100 transition-colors
          ${showSearch ? 'hidden' : ''}
        `}
        onClick={() => setShowSearch(true)}
        aria-label="Показать поиск"
      >
        <MagnifyingGlassIcon
          className="w-6 h-6 text-gray-600 hover:text-indigo-600 transition-colors"
          aria-hidden="true"
        />
      </button>
    </div>
  )
}