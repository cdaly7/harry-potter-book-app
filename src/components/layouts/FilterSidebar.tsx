import { X, ArrowUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm, clearSearchTerm, setSortBy, toggleSortDirection, toggleLanguage, clearLanguageFilter, type SortOption } from '../book-list/slice';
import { selectSearchTerm, selectSortBy, selectSortDirection, selectSelectedLanguages, selectAvailableLanguages } from '../book-list/selectors';
import type { AppDispatch } from '../../store';
import { useDebounce } from '../../hooks/useDebounce';
import './FilterSidebar.css';

// Language code to name mapping
const LANGUAGE_NAMES: Record<string, string> = {
  'afr': 'Afrikaans',
  'alb': 'Albanian',
  'ara': 'Arabic',
  'arm': 'Armenian',
  'baq': 'Basque',
  'ben': 'Bengali',
  'bos': 'Bosnian',
  'bqa': 'Azerbaijani',
  'bul': 'Bulgarian',
  'cat': 'Catalan',
  'chi': 'Chinese',
  'cze': 'Czech',
  'dan': 'Danish',
  'dut': 'Dutch',
  'eng': 'English',
  'est': 'Estonian',
  'fin': 'Finnish',
  'fre': 'French',
  'gem': 'Germanic',
  'geo': 'Georgian',
  'ger': 'German',
  'gla': 'Gaelic',
  'gle': 'Irish',
  'glg': 'Galician',
  'grc': 'Ancient Greek',
  'gre': 'Greek',
  'heb': 'Hebrew',
  'hin': 'Hindi',
  'hrv': 'Croatian',
  'hun': 'Hungarian',
  'ice': 'Icelandic',
  'ind': 'Indonesian',
  'ita': 'Italian',
  'jpn': 'Japanese',
  'kal': 'Kalaallisut',
  'kor': 'Korean',
  'lat': 'Latin',
  'lav': 'Latvian',
  'lit': 'Lithuanian',
  'ltz': 'Luxembourgish',
  'mar': 'Marathi',
  'mul': 'Multiple',
  'nob': 'Norwegian',
  'nor': 'Norwegian',
  'per': 'Persian',
  'pol': 'Polish',
  'por': 'Portuguese',
  'ron': 'Romanian',
  'rum': 'Macedonian',
  'rus': 'Russian',
  'spa': 'Spanish',
  'swe': 'Swedish',
  'tha': 'Thai',
  'tib': 'Tibetan',
  'tur': 'Turkish',
  'ukr': 'Ukrainian',
  'und': 'Undetermined',
  'urd': 'Urdu',
  'vie': 'Vietnamese',
  'wel': 'Welsh',
  'yid': 'Yiddish'
};

export function FilterSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const searchTerm = useSelector(selectSearchTerm);
  const sortBy = useSelector(selectSortBy);
  const sortDirection = useSelector(selectSortDirection);
  const selectedLanguages = useSelector(selectSelectedLanguages);
  const availableLanguages = useSelector(selectAvailableLanguages);

  // Local state for immediate input feedback
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Update Redux store with debounced value
  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchTerm));
  }, [debouncedSearchTerm, dispatch]);

  // Sync local state when Redux state changes (e.g., clear button)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const hasActiveFilters = searchTerm.length > 0 || selectedLanguages.length > 0;

  const handleClearFilters = () => {
    dispatch(clearSearchTerm());
    dispatch(clearLanguageFilter());
  };

  const getLanguageName = (code: string): string => {
    return LANGUAGE_NAMES[code] || code.toUpperCase();
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-content">
        <div className="filter-header">
          <h2 className="filter-title" id="filters-heading">Filters & Sort</h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="clear-filters-btn"
              title="Clear all filters"
              aria-label="Clear all active filters"
            >
              <X className="icon" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        {/* Search Section */}
        <div className="filter-section">
          <h3 className="section-title">Search</h3>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Search by title..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              aria-label="Search books"
            />
            {localSearchTerm && (
              <button
                className="search-clear-btn"
                onClick={() => {
                  setLocalSearchTerm('');
                  dispatch(clearSearchTerm());
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sort Section */}
        <div className="filter-section">
          <h3 className="section-title">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
            className="sidebar-select"
            aria-label="Sort books"
          >
            <option value="title">Title</option>
            <option value="publishDate">Publish Date</option>
            <option value="editionCount">Edition Count</option>
          </select>

          <button
            onClick={() => dispatch(toggleSortDirection())}
            className="sort-direction-btn"
            aria-label={`Change sort direction to ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="icon" aria-hidden="true" />
            {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        {/* Language Filter Section */}
        <div className="filter-section">
          <h3 className="section-title">Languages</h3>
          <div className="language-filter">
            {availableLanguages.length === 0 ? (
              <p className="no-languages">No languages available</p>
            ) : (
              <div className="language-checkboxes" role="group" aria-label="Filter by languages">
                {availableLanguages.map((lang) => (
                  <label key={lang} className="language-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => dispatch(toggleLanguage(lang))}
                      className="language-checkbox"
                      aria-label={`Filter by ${getLanguageName(lang)}`}
                    />
                    <span className="language-name" aria-hidden="true">{getLanguageName(lang)}</span>
                  </label>
                ))}
              </div>
            )}
            {selectedLanguages.length > 0 && (
              <p className="selected-count">
                {selectedLanguages.length} selected
              </p>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="filter-info">
          <p className="info-text">
            Showing Harry Potter books by J.K. Rowling
            {selectedLanguages.length > 0 && ` in ${selectedLanguages.length} language${selectedLanguages.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>
    </aside>
  );
}