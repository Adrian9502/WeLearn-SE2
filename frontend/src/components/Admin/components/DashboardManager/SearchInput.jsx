import PropTypes from "prop-types";
import React from "react";
import { Search } from "lucide-react";

const SearchInput = ({ searchTerm = "", onSearchChange = () => {} }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
};

export default SearchInput;
