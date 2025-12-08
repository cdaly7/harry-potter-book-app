import { RootState } from '../../store';
import { openLibraryApi } from '../apis/openLibraryApi';
import type { Book } from '../apis/openLibraryApi';

/**
 * Selector to get all books from the cache
 */
export const selectAllBooks = (state: RootState): Book[] | undefined => {
    const result = openLibraryApi.endpoints.searchBooks.select()(state);
    return result.data;
};
