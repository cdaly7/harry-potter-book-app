import React from 'react';
import './BookCover.css';

interface BookCoverProps {
  coverImageId?: number;
  title: string;
  size?: 'small' | 'medium' | 'large';
  loading?: 'lazy' | 'eager';
}

export function BookCover({ coverImageId, title, size = 'medium', loading = 'lazy' }: BookCoverProps) {
  if (!coverImageId) {
    return <div className={`no-cover no-cover-${size}`}>No Cover Available</div>;
  }

  return (
    <img
      src={`https://covers.openlibrary.org/b/id/${coverImageId}-M.jpg`}
      srcSet={`https://covers.openlibrary.org/b/id/${coverImageId}-M.jpg 1x, https://covers.openlibrary.org/b/id/${coverImageId}-L.jpg 2x`}
      alt={title}
      loading={loading}
      decoding="async"
      className={`book-cover-image book-cover-${size}`}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Cover';
      }}
    />
  );
}
