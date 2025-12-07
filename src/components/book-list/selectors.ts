import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';
import type { BookListState } from './slice';
import { selectAllBooks } from '../../state/books/selectors';

/**
 * Selector to get the search term from bookList state
 */
export const selectSearchTerm = createSelector(
    (state: RootState) => state.bookList,
    (bookList: BookListState) => bookList.searchTerm || ''
);

/**
 * Selector to get the sort option from bookList state
 */
export const selectSortBy = createSelector(
    (state: RootState) => state.bookList,
    (bookList: BookListState) => bookList.sortBy || 'title'
);

/**
 * Memoized selector to search books by title
 */
export const selectBooksByTitle = createSelector(
    [selectAllBooks, selectSearchTerm],
    (books, searchTerm) => {
        if (!books || !searchTerm) return books ?? [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return books.filter(book =>
            book.title.toLowerCase().includes(lowerSearchTerm)
        );
    }
);

/**
 * Helper function to get note count for a book
 */
const getNoteCount = (state: RootState, bookKey: string): number => {
    return state.notes.notesByBook[bookKey]?.length || 0;
};

/**
 * Memoized selector to get filtered and sorted books
 */
export const selectFilteredAndSortedBooks = createSelector(
    [
        (state: RootState) => state,
        selectAllBooks,
        selectSearchTerm,
        selectSortBy
    ],
    (state, books, searchTerm, sortBy) => {
        if (!books) return [];
        
        // Filter by search term
        let filteredBooks = books;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(lowerSearchTerm)
            );
        }
        
        // Sort based on sortBy option
        const sortedBooks = [...filteredBooks];
        
        switch (sortBy) {
            case 'title':
                sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            
            case 'publishDate':
                sortedBooks.sort((a, b) => {
                    const yearA = a.firstPublishYear ?? 9999;
                    const yearB = b.firstPublishYear ?? 9999;
                    return yearA - yearB;
                });
                break;
            
            case 'notes':
                sortedBooks.sort((a, b) => {
                    const notesA = getNoteCount(state, a.key);
                    const notesB = getNoteCount(state, b.key);
                    return notesB - notesA; // Descending order (most notes first)
                });
                break;
            
            default:
                // Default to title sort
                sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        }
        
        return sortedBooks;
    }
);