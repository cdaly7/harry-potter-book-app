import { useParams, useNavigate } from 'react-router-dom';
import { useGetBookDetailsQuery } from '../../state/apis/openLibraryApi';
import Notes from '../notes/Notes';
import './BookDetails.css';
import { BookCover } from '../ui/BookCover';
import { LoadingSpinner } from '../ui/LoadingSpinner';

function BookDetails() {
  const { workKey } = useParams<{ workKey: string }>();
  const navigate = useNavigate();
  const bookKey = `/works/${workKey}`;
  
  const { data: book, error, isLoading } = useGetBookDetailsQuery(bookKey);

  if (isLoading) return <LoadingSpinner message="Loading book details..." />;
  if (error) return <div className="error">Error loading book details: {'message' in error ? error.message : 'An error occurred'}</div>;
  if (!book) return <div className="error">Book not found</div>;

  return (
    <div className="book-details-container">
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
        aria-label="Go back to book list"
      >
        ← Back to List
      </button>
      
      <div className="book-details-content">
        <article className="book-details-header" aria-labelledby="book-title">
          <div className="book-cover-large">
            <BookCover 
              coverImageId={book.coverId} 
              title={book.title}
              size="large"
              loading="eager"
            />
          </div>

          <div className="book-details-info">
            <h1 id="book-title">{book.title}</h1>
            <p className="author">By J.K. Rowling</p>
            
            {book.created && (
              <p className="published-date">
                <strong>Created:</strong> {new Date(book.created).toLocaleDateString()}
              </p>
            )}

            <div className="description">
              <h2>Description</h2>
              <p>{book.description}</p>
            </div>

            {book.subjects && book.subjects.length > 0 && (
              <div className="subjects">
                <h3>Subjects</h3>
                <div className="subject-tags">
                  {book.subjects.slice(0, 10).map((subject, index) => (
                    <span key={index} className="subject-tag">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        <section className="notes-section" aria-label="Book notes">
          <Notes bookKey={bookKey} />
        </section>
      </div>
    </div>
  );
}

export default BookDetails;
