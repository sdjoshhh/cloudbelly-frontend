import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query);
    setQuery("")
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative max-w-md mx-auto mt-10 flex flex-row items-center gap-2 pt-8">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={handleSearch}
        className="h-10 px-4 py-2 bg-blue-600 text-white shadow-sm rounded-xl text-sm cursor-pointer"
      >
        <FaMagnifyingGlass />
      </button>
    </div>
  );
};

export default SearchBar
