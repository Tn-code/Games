import React, { useState } from 'react';

export function AdvancedSearch({ onSearch, onFilter, onSort }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/50 mb-6">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search stories, videos, quizzes..."
            value={searchTerm}
            onChange={handleSearch}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
        >
          <i className={`fas fa-sliders-h ${isExpanded ? 'text-purple-600' : ''}`}></i>
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeInUp">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                onFilter(e.target.value);
              }}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                onSort(e.target.value);
              }}
              className="input-field"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
