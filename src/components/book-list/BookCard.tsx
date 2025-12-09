import { Link } from 'react-router-dom';
import { BookCover } from '../ui/BookCover';
import type { Book } from '../../state/apis/openLibraryApi';

interface BookCardProps {
  book: Book;
  index: number;
}

export function BookCard({ book, index }: BookCardProps) {
  return (
    <Link
      to={`/book${book.key}`}
      className="book-card"
      aria-label={`View details for ${book.title}${book.firstPublishYear ? `, published in ${book.firstPublishYear}` : ''}`}
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
        {book.firstPublishYear && (
          <p className="year">First Published: {book.firstPublishYear}</p>
        )}
      </div>
    </Link>
  );
}
