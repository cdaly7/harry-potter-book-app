import React from 'react';
import { useSearchBooksQuery } from '../../state/apis/openLibraryApi';
import {
    setSearchTerm,
    clearSearchTerm,
    setSortBy,
    type SortOption
} from './slice';
import { 
  selectSearchTerm,
  selectSortBy,
  selectFilteredAndSortedBooks,
} from './selectors';
import { Link } from 'react-router-dom';
import './BookList.css';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import harryBanner from '../../assets/harry_banner.webp';

function BookList() {
  const dispatch = useDispatch<AppDispatch>();
  const searchTerm = useSelector(selectSearchTerm);
  const sortBy = useSelector(selectSortBy);
  const { error, isLoading } = useSearchBooksQuery();
  const filteredBooks = useSelector(selectFilteredAndSortedBooks)
  
  if (isLoading) return <div className="loading">Loading Harry Potter books...</div>;
  if (error) return <div className="error">Error loading books: {'message' in error ? error.message : 'An error occurred'}</div>;

  const booksToDisplay = filteredBooks;
  const resultCount = booksToDisplay?.length ?? 0;

  return (
    <div className="book-list-container">
      <img src={harryBanner} alt="Harry Potter Books by J.K. Rowling" className="banner-image" />
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search books by title..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchTerm(e.target.value))}
          aria-label="Search books"
        />
        {searchTerm && (
          <button 
            className="clear-button"
            onClick={() => dispatch(clearSearchTerm())}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="controls-row">
        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select 
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              dispatch(setSortBy(e.target.value as SortOption))
            }
            aria-label="Sort books"
          >
            <option value="title">Title</option>
            <option value="publishDate">Publish Date</option>
            <option value="notes">Number of Notes</option>
          </select>
        </div>

        <div className="results-info">
          {searchTerm && (
            <p>
              Found {resultCount} book{resultCount !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          )}
        </div>
      </div>
      
      <div className="book-grid">
        {booksToDisplay?.length === 0 ? (
          <div className="no-results">
            <p>No books found matching "{searchTerm}"</p>
            <button onClick={() => dispatch(clearSearchTerm())} className="reset-button">
              Clear search
            </button>
          </div>
        ) : (
          booksToDisplay?.map((book) => (
            <Link 
              to={`/book${book.key}`} 
              key={book.key} 
              className="book-card"
            >
            <div className="book-cover">
              {book.coverImageId ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.coverImageId}-L.jpg`}
                  alt={book.title}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                  }}
                />
              ) : (
                <div className="no-cover">No Cover Available</div>
              )}
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">{book.author}</p>
              {book.firstPublishYear && (
                <p className="year">First Published: {book.firstPublishYear}</p>
              )}
            </div>
          </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default BookList;
