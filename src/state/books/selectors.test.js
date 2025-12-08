import {
  selectBookByKey,
  selectBooksSortedByTitle,
  selectBooksSortedByYear,
  selectBooksWithCovers,
  selectBooksCount,
  selectBooksByTitle,
  selectBooksByYearRange,
} from './selectors';

describe('Book Selectors', () => {
  const mockBooks = [
    {
      key: '/works/OL82563W',
      title: "Harry Potter and the Philosopher's Stone",
      authors: ['J.K. Rowling'],
      coverImageId: 8739161,
      firstPublishYear: 1997,
      isbn: '0439708184',
      language: ['eng'],
    },
    {
      key: '/works/OL82564W',
      title: 'Harry Potter and the Chamber of Secrets',
      authors: ['J.K. Rowling'],
      coverImageId: 8739162,
      firstPublishYear: 1998,
      isbn: '0439064872',
      language: ['eng'],
    },
    {
      key: '/works/OL82565W',
      title: 'Harry Potter and the Prisoner of Azkaban',
      authors: ['J.K. Rowling'],
      firstPublishYear: 1999,
      language: ['eng'],
    },
  ];

  // Mock state with books data
  const createMockState = (books, searchTerm = '') => ({
    openLibraryApi: {
      queries: {
        'searchBooks(undefined)': {
          status: 'fulfilled',
          data: books,
          isLoading: false,
          isSuccess: true,
        },
      },
    },
    notes: {
      notesByBook: {},
    },
    bookList: {
      searchTerm,
    },
  });

  describe('selectBookByKey', () => {
    it('should return a specific book by key', () => {
      const state = createMockState(mockBooks);
      const result = selectBookByKey(state, '/works/OL82563W');
      expect(result).toEqual(mockBooks[0]);
    });

    it('should return undefined for non-existent key', () => {
      const state = createMockState(mockBooks);
      const result = selectBookByKey(state, '/works/NONEXISTENT');
      expect(result).toBeUndefined();
    });

    it('should return undefined when no books are loaded', () => {
      const state = createMockState(undefined);
      const result = selectBookByKey(state, '/works/OL82563W');
      expect(result).toBeUndefined();
    });
  });

  describe('selectBooksSortedByTitle', () => {
    it('should return books sorted alphabetically by title', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksSortedByTitle(state);
      expect(result[0].title).toBe('Harry Potter and the Chamber of Secrets');
      expect(result[1].title).toBe("Harry Potter and the Philosopher's Stone");
      expect(result[2].title).toBe('Harry Potter and the Prisoner of Azkaban');
    });

    it('should return empty array when no books are loaded', () => {
      const state = createMockState(undefined);
      const result = selectBooksSortedByTitle(state);
      expect(result).toEqual([]);
    });
  });

  describe('selectBooksSortedByYear', () => {
    it('should return books sorted by publication year', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksSortedByYear(state);
      expect(result[0].firstPublishYear).toBe(1997);
      expect(result[1].firstPublishYear).toBe(1998);
      expect(result[2].firstPublishYear).toBe(1999);
    });
  });

  describe('selectBooksWithCovers', () => {
    it('should return only books with cover images', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksWithCovers(state);
      expect(result).toHaveLength(2);
      expect(result.every(book => book.coverImageId !== undefined)).toBe(true);
    });
  });

  describe('selectBooksCount', () => {
    it('should return 0 when no books are loaded', () => {
      const state = createMockState(undefined);
      const result = selectBooksCount(state);
      expect(result).toBe(0);
    });

    it('should return the correct count of books', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksCount(state);
      expect(result).toBe(3);
    });
  });

  describe('selectBooksByTitle', () => {
    it('should filter books by title search term', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksByTitle(state, 'Chamber');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Harry Potter and the Chamber of Secrets');
    });

    it('should be case insensitive', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksByTitle(state, 'prisoner');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Harry Potter and the Prisoner of Azkaban');
    });

    it('should return all books when search term is empty', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksByTitle(state, '');
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no matches found', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksByTitle(state, 'Goblet');
      expect(result).toHaveLength(0);
    });
  });

  describe('selectBooksByYearRange', () => {
    it('should filter books by year range', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksByYearRange(state, 1997, 1998);
      expect(result).toHaveLength(2);
      expect(result[0].firstPublishYear).toBe(1997);
      expect(result[1].firstPublishYear).toBe(1998);
    });

    it('should return empty array when no books match the range', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksByYearRange(state, 2000, 2010);
      expect(result).toHaveLength(0);
    });

    it('should include books at range boundaries', () => {
      const state = createMockState(mockBooks);
      const result = selectBooksByYearRange(state, 1998, 1999);
      expect(result).toHaveLength(2);
    });
  });
});
