import React from 'react';
import './BookCover.css';
import { useLazyImage } from '../../hooks/useLazyImage';

interface BookCoverProps {
  coverImageId?: number;
  title: string;
  size?: 'small' | 'medium' | 'large';
  loading?: 'lazy' | 'eager';
}

export function BookCover({ coverImageId, title, size = 'medium', loading = 'lazy' }: BookCoverProps) {
  const { shouldLoad, imgRef } = useLazyImage({ rootMargin: '200px' });
  const eagerLoad = loading === 'eager';

  if (!coverImageId) {
    return <div className={`no-cover no-cover-${size}`}>No Cover Available</div>;
  }

  // For eager loading (first 6 images), load immediately
  // For lazy loading, wait until Intersection Observer triggers
  const showImage = eagerLoad || shouldLoad;

  return (
    <div ref={imgRef} className={`book-cover-wrapper book-cover-${size}`}>
      {showImage ? (
        <img
          src={`https://covers.openlibrary.org/b/id/${coverImageId}-M.jpg`}
          srcSet={`https://covers.openlibrary.org/b/id/${coverImageId}-M.jpg 1x, https://covers.openlibrary.org/b/id/${coverImageId}-L.jpg 2x`}
          alt={title}
          decoding="async"
          className={`book-cover-image book-cover-${size}`}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Cover';
          }}
        />
      ) : (
        <div className={`book-cover-placeholder book-cover-${size}`} />
      )}
    </div>
  );
}
