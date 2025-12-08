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
 * Selector to get the sort direction from bookList state
 */
export const selectSortDirection = createSelector(
    (state: RootState) => state.bookList,
    (bookList: BookListState) => bookList.sortDirection || 'asc'
);

/**
 * Selector to get the selected languages from bookList state
 */
export const selectSelectedLanguages = createSelector(
    (state: RootState) => state.bookList,
    (bookList: BookListState) => bookList.selectedLanguages || []
);

/**
 * Selector to get unique languages from all books
 */
export const selectAvailableLanguages = createSelector(
    [selectAllBooks],
    (books) => {
        if (!books) return [];
        const languageSet = new Set<string>();
        books.forEach(book => {
            book.language?.forEach(lang => languageSet.add(lang));
        });
        return Array.from(languageSet).sort();
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
        selectSortBy,
        selectSortDirection,
        selectSelectedLanguages
    ],
    (state, books, searchTerm, sortBy, sortDirection, selectedLanguages) => {
        if (!books) return [];
        
        // Filter by search term
        let filteredBooks = books;
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(lowerSearchTerm)
            );
        }
        
        // Filter by selected languages (if any selected)
        if (selectedLanguages.length > 0) {
            filteredBooks = filteredBooks.filter(book => 
                book.language?.some(lang => selectedLanguages.includes(lang))
            );
        }
        
        // Sort based on sortBy option
        const sortedBooks = [...filteredBooks];
        
        switch (sortBy) {
            case 'title':
                sortedBooks.sort((a, b) => {
                    const comparison = a.title.localeCompare(b.title);
                    return sortDirection === 'asc' ? comparison : -comparison;
                });
                break;
            
            case 'publishDate':
                sortedBooks.sort((a, b) => {
                    const yearA = a.firstPublishYear ?? 9999;
                    const yearB = b.firstPublishYear ?? 9999;
                    const comparison = yearA - yearB;
                    return sortDirection === 'asc' ? comparison : -comparison;
                });
                break;
            
            case 'notes':
                sortedBooks.sort((a, b) => {
                    const notesA = getNoteCount(state, a.key);
                    const notesB = getNoteCount(state, b.key);
                    const comparison = notesA - notesB;
                    return sortDirection === 'asc' ? comparison : -comparison;
                });
                break;
            
            default:
                // Default to title sort
                sortedBooks.sort((a, b) => {
                    const comparison = a.title.localeCompare(b.title);
                    return sortDirection === 'asc' ? comparison : -comparison;
                });
        }
        
        return sortedBooks;
    }
);