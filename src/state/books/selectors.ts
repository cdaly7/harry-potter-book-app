import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { openLibraryApi } from '../apis/openLibraryApi';
import type { Book, BookDetails } from '../apis/openLibraryApi';

/**
 * Selector to get the search term from bookList state
 */
export const selectSearchTerm = (state: RootState): string => {
  return state.bookList?.searchTerm || '';
};

/**
 * Selector to get all Harry Potter books from the cache
 */
export const selectAllBooks = (state: RootState): Book[] | undefined => {
  const result = openLibraryApi.endpoints.searchBooks.select()(state);
  return result.data;
};

/**
 * Memoized selector to get a specific book by key
 */
export const selectBookByKey = createSelector(
  [selectAllBooks, (_state: RootState, bookKey: string) => bookKey],
  (books, bookKey) => {
    return books?.find(book => book.key === bookKey);
  }
);

/**
 * Selector factory to get book details by work key
 */
export const selectBookDetails = (workKey: string) => (state: RootState): BookDetails | undefined => {
  const result = openLibraryApi.endpoints.getBookDetails.select(workKey)(state);
  return result.data;
};

/**
 * Selector factory to check if book details are loading
 */
export const selectBookDetailsLoading = (workKey: string) => (state: RootState): boolean => {
  const result = openLibraryApi.endpoints.getBookDetails.select(workKey)(state);
  return result.isLoading;
};

/**
 * Selector factory to get book details error
 */
export const selectBookDetailsError = (workKey: string) => (state: RootState): unknown => {
  const result = openLibraryApi.endpoints.getBookDetails.select(workKey)(state);
  return result.error;
};

/**
 * Memoized selector to get books sorted by title
 */
export const selectBooksSortedByTitle = createSelector(
  [selectAllBooks],
  (books) => {
    if (!books) return [];
    return [...books].sort((a, b) => a.title.localeCompare(b.title));
  }
);

/**
 * Memoized selector to get books sorted by publication year
 */
export const selectBooksSortedByYear = createSelector(
  [selectAllBooks],
  (books) => {
    if (!books) return [];
    return [...books].sort((a, b) => {
      const yearA = a.firstPublishYear ?? 0;
      const yearB = b.firstPublishYear ?? 0;
      return yearA - yearB;
    });
  }
);

/**
 * Memoized selector to get books with cover images
 */
export const selectBooksWithCovers = createSelector(
  [selectAllBooks],
  (books) => {
    if (!books) return [];
    return books.filter(book => book.coverImageId !== undefined);
  }
);

/**
 * Memoized selector to get total number of books
 */
export const selectBooksCount = createSelector(
  [selectAllBooks],
  (books) => books?.length ?? 0
);

/**
 * Memoized selector to search books by title
 */
export const selectBooksByTitle = createSelector(
  [selectAllBooks, (_state: RootState, searchTerm: string) => searchTerm],
  (books, searchTerm) => {
    if (!books || !searchTerm) return books ?? [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerSearchTerm)
    );
  }
);

/**
 * Memoized selector to get books by publication year range
 */
export const selectBooksByYearRange = createSelector(
  [
    selectAllBooks, 
    (_state: RootState, startYear: number) => startYear,
    (_state: RootState, _startYear: number, endYear: number) => endYear
  ],
  (books, startYear, endYear) => {
    if (!books) return [];
    return books.filter(book => {
      const year = book.firstPublishYear;
      return year !== undefined && year >= startYear && year <= endYear;
    });
  }
);
