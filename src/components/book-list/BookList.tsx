import { useEffect } from 'react';
import { useSearchBooksQuery } from '../../state/apis/openLibraryApi';
import {
  selectSearchTerm,
  selectFilteredAndSortedBooks,
} from './selectors';
import './BookList.css';
import { useSelector } from 'react-redux';
import harryBanner from '../../assets/harry_banner.webp';
import { FilterSidebar } from '../layouts/FilterSidebar';
import { preloadImages, getCoverImageUrl } from '../../utils/imagePreloader';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { BookCard } from './BookCard';

function BookList() {
  const searchTerm = useSelector(selectSearchTerm);
  const { error, isLoading } = useSearchBooksQuery();
  const filteredBooks = useSelector(selectFilteredAndSortedBooks);

  // Preconnect to OpenLibrary CDN for faster image loading
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://covers.openlibrary.org';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Preload first 6 visible book covers for faster initial render
  useEffect(() => {
    if (filteredBooks && filteredBooks.length > 0) {
      const imagesToPreload = filteredBooks
        .slice(0, 6)
        .filter(book => book.coverImageId)
        .map(book => getCoverImageUrl(book.coverImageId!, 'M'));

      preloadImages(imagesToPreload).catch(err => {
        console.warn('Error preloading images:', err);
      });
    }
  }, [filteredBooks]);

  const booksToDisplay = filteredBooks;
  const resultCount = booksToDisplay?.length ?? 0;

  return (
    <div className="app-layout">
      <FilterSidebar />

      <main className="main-content" aria-label="Book list">
        <img src={harryBanner} alt="Harry Potter Books by J.K. Rowling" className="banner-image" />
        { 
          error ? 
          <div className="error">Error loading books: {'message' in error ? error.message : 'An error occurred'}</div> :
          isLoading ? 
          <LoadingSpinner message="Loading Harry Potter books..." /> :
          <div>
          {searchTerm && booksToDisplay?.length !== 0 && (
            <div className="results-info" role="status" aria-live="polite">
              <p>
                Found {resultCount} book{resultCount !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}

          <div className="book-grid" aria-label="Harry Potter books">
            {booksToDisplay?.length === 0 ? (
              <div className="no-results" role="status">
                <p>No books found{searchTerm && ` matching \"${searchTerm}\"`}</p>
              </div>
            ) : (
              booksToDisplay?.map((book, index) => (
                <BookCard key={book.key} book={book} index={index} />
              ))
            )}
          </div>
          </div>
        }
      </main>
    </div>
  );
}

export default BookList;
