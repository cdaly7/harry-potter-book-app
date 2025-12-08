import { X, ArrowUpDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm, clearSearchTerm, setSortBy, toggleSortDirection, toggleLanguage, clearLanguageFilter, type SortOption } from '../book-list/slice';
import { selectSearchTerm, selectSortBy, selectSortDirection, selectSelectedLanguages, selectAvailableLanguages } from '../book-list/selectors';
import type { AppDispatch } from '../../store';
import './FilterSidebar.css';

// Language code to name mapping
const LANGUAGE_NAMES: Record<string, string> = {
  'eng': 'English',
  'spa': 'Spanish',
  'fre': 'French',
  'ger': 'German',
  'ita': 'Italian',
  'por': 'Portuguese',
  'dut': 'Dutch',
  'rus': 'Russian',
  'jpn': 'Japanese',
  'chi': 'Chinese',
  'ara': 'Arabic',
  'kor': 'Korean',
  'pol': 'Polish',
  'swe': 'Swedish',
  'nor': 'Norwegian',
  'dan': 'Danish',
  'fin': 'Finnish',
  'gre': 'Greek',
  'tur': 'Turkish',
  'heb': 'Hebrew',
  'ukr': 'Ukrainian',
  'hun': 'Hungarian',
  'cze': 'Czech',
  'ron': 'Romanian',
  'vie': 'Vietnamese',
  'ice': 'Icelandic',
  'tib': 'Tibetan',
  'est': 'Estonian',
  'lav': 'Latvian',
  'lit': 'Lithuanian',
  'rum': 'Macedonian',
  'bul': 'Bulgarian',
  'yid': 'Yiddish',
  'wel': 'Welsh',
  'urd': 'Urdu',
  'und': 'Undetermined',
  'tha': 'Thai',
  'per': 'Persian',
  'nob': 'Norwegian',
  'mul': 'Multiple',
  'mar': 'Marathi',
  'ltz': 'Luxembourgish',
  'lat': 'Latin',
  'kal': 'Kalaallisut',
  'ind': 'Indonesian',
  'hrv': 'Croatian',
  'hin': 'Hindi',
  'glg': 'Galician',
  'grc': 'Ancient Greek',
  'afr': 'Afrikaans',
  'alb': 'Albanian',
  'arm': 'Armenian',
  'baq': 'Basque',
  'bqa': 'Azerbaijani',
  'ben': 'Bengali',
  'bos': 'Bosnian',
  'cat': 'Catalan',
  'gem': 'Germanic',
  'geo': 'Georgian',
  'gla': 'Gaelic',
  'gle': 'Irish'

};

export function FilterSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const searchTerm = useSelector(selectSearchTerm);
  const sortBy = useSelector(selectSortBy);
  const sortDirection = useSelector(selectSortDirection);
  const selectedLanguages = useSelector(selectSelectedLanguages);
  const availableLanguages = useSelector(selectAvailableLanguages);

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
          <h2 className="filter-title">Filters & Sort</h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="clear-filters-btn"
              title="Clear all filters"
            >
              <X className="icon" />
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
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              aria-label="Search books"
            />
            {searchTerm && (
              <button 
                className="search-clear-btn"
                onClick={() => dispatch(clearSearchTerm())}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Language Filter Section */}
        <div className="filter-section">
          <h3 className="section-title">Languages</h3>
          <div className="language-filter">
            {availableLanguages.length === 0 ? (
              <p className="no-languages">No languages available</p>
            ) : (
              <div className="language-checkboxes">
                {availableLanguages.map((lang) => (
                  <label key={lang} className="language-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => dispatch(toggleLanguage(lang))}
                      className="language-checkbox"
                    />
                    <span className="language-name">{getLanguageName(lang)}</span>
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
            <option value="notes">Number of Notes</option>
          </select>
          
          <button
            onClick={() => dispatch(toggleSortDirection())}
            className="sort-direction-btn"
            title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="icon" />
            {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
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