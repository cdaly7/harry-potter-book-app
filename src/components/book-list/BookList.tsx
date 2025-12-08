import { useEffect } from 'react';
import { useSearchBooksQuery } from '../../state/apis/openLibraryApi';
import {
  selectSearchTerm,
  selectFilteredAndSortedBooks,
} from './selectors';
import { Link } from 'react-router-dom';
import './BookList.css';
import { useSelector } from 'react-redux';
import harryBanner from '../../assets/harry_banner.webp';
import { FilterSidebar } from '../layouts/FilterSidebar';
import { preloadImages, getCoverImageUrl } from '../../utils/imagePreloader';
import { BookCover } from '../ui/BookCover';
import { LoadingSpinner } from '../ui/LoadingSpinner';

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

  if (error) return <div className="error">Error loading books: {'message' in error ? error.message : 'An error occurred'}</div>;

  const booksToDisplay = filteredBooks;
  const resultCount = booksToDisplay?.length ?? 0;

  return (
    <div className="app-layout">
      <FilterSidebar />

      <main className="main-content">
        <img src={harryBanner} alt="Harry Potter Books by J.K. Rowling" className="banner-image" />
        { 
          isLoading ? 
          <LoadingSpinner message="Loading Harry Potter books..." /> :
          <div>
          {searchTerm && (
            <div className="results-info">
              <p>
                Found {resultCount} book{resultCount !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}

          <div className="book-grid">
            {booksToDisplay?.length === 0 ? (
              <div className="no-results">
                <p>No books found{searchTerm && ` matching "${searchTerm}"`}</p>
              </div>
            ) : (
              booksToDisplay?.map((book, index) => (
                <Link
                  to={`/book${book.key}`}
                  key={book.key}
                  className="book-card"
                >
                  <div className="book-cover">
                    <BookCover
                      coverImageId={book.coverImageId}
                      title={book.title}
                      size="medium"
                      loading={index < 6 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="author">{book.authors?.[0] || 'Unknown Author'}</p>
                    {book.firstPublishYear && (
                      <p className="year">First Published: {book.firstPublishYear}</p>
                    )}
                  </div>
                </Link>
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
