import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import { debounce } from 'lodash';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length > 0) {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:3001/api/search?query=${searchQuery}`);
          setResults(response.data);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300), // 300ms debounce delay
    []
  );

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a stock..."
          className="search-input"
        />
        {query && (
          <button onClick={clearSearch} className="clear-button">
            <X size={18} />
          </button>
        )}
      </div>
      {query && (
        <div className="search-results-dropdown">
          {isLoading ? (
            <div className="result-item loading">Searching...</div>
          ) : results.length > 0 ? (
            results.map((stock) => (
              <a href={`/trends/${stock.symbol}`} key={stock.symbol} className="result-item">
                <span className="result-symbol">{stock.symbol}</span>
                <span className="result-price">${parseFloat(stock.price).toFixed(2)}</span>
              </a>
            ))
          ) : (
            <div className="result-item no-results">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
