import {
  selectSearchTerm,
  selectSortBy,
  selectBooksByTitle,
  selectFilteredAndSortedBooks,
} from './selectors';

describe('BookList Selectors', () => {
  const mockBooks = [
    { 
      key: '/works/1', 
      title: 'Harry Potter and the Philosopher\'s Stone', 
      firstPublishYear: 1997,
      author: 'J.K. Rowling'
    },
    { 
      key: '/works/2', 
      title: 'Harry Potter and the Chamber of Secrets', 
      firstPublishYear: 1998,
      author: 'J.K. Rowling'
    },
    { 
      key: '/works/3', 
      title: 'The Hobbit', 
      firstPublishYear: 1937,
      author: 'J.R.R. Tolkien'
    },
    { 
      key: '/works/4', 
      title: 'A Game of Thrones', 
      firstPublishYear: 1996,
      author: 'George R.R. Martin'
    },
    { 
      key: '/works/5', 
      title: 'The Fellowship of the Ring', 
      firstPublishYear: null, // Test null publish date
      author: 'J.R.R. Tolkien'
    },
  ];

  const createMockState = (searchTerm = '', sortBy = 'title', notes = {}) => ({
    openLibraryApi: {
      queries: {
        'searchBooks(undefined)': {
          status: 'fulfilled',
          endpointName: 'searchBooks',
          isUninitialized: false,
          isLoading: false,
          isSuccess: true,
          isError: false,
          data: mockBooks,
        },
      },
    },
    bookList: {
      searchTerm,
      sortBy,
    },
    notes: {
      notesByBook: notes,
    },
  });

  describe('selectSearchTerm', () => {
    it('should return the search term from state', () => {
      const state = createMockState('Harry');
      expect(selectSearchTerm(state)).toBe('Harry');
    });

    it('should return empty string when no search term', () => {
      const state = createMockState('');
      expect(selectSearchTerm(state)).toBe('');
    });
  });

  describe('selectSortBy', () => {
    it('should return the sort option from state', () => {
      const state = createMockState('', 'publishDate');
      expect(selectSortBy(state)).toBe('publishDate');
    });

    it('should return title by default', () => {
      const state = createMockState('', 'title');
      expect(selectSortBy(state)).toBe('title');
    });

    it('should return notes sort option', () => {
      const state = createMockState('', 'notes');
      expect(selectSortBy(state)).toBe('notes');
    });
  });

  describe('selectBooksByTitle', () => {
    it('should return all books when no search term', () => {
      const state = createMockState('');
      const result = selectBooksByTitle(state);
      expect(result).toHaveLength(5);
    });

    it('should filter books by search term in title', () => {
      const state = createMockState('Harry Potter');
      const result = selectBooksByTitle(state);
      expect(result).toHaveLength(2);
      expect(result[0].title).toContain('Harry Potter');
      expect(result[1].title).toContain('Harry Potter');
    });

    it('should filter books by search term in title only', () => {
      const state = createMockState('Tolkien');
      const result = selectBooksByTitle(state);
      expect(result).toHaveLength(0); // selectBooksByTitle only filters by title
    });

    it('should be case insensitive', () => {
      const state = createMockState('harry potter');
      const result = selectBooksByTitle(state);
      expect(result).toHaveLength(2);
    });

    it('should handle partial matches', () => {
      const state = createMockState('Potter');
      const result = selectBooksByTitle(state);
      expect(result).toHaveLength(2);
    });
  });

  describe('selectFilteredAndSortedBooks', () => {
    describe('sorting by title', () => {
      it('should sort books alphabetically by title', () => {
        const state = createMockState('', 'title');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result[0].title).toBe('A Game of Thrones');
        expect(result[1].title).toBe('Harry Potter and the Chamber of Secrets');
        expect(result[2].title).toBe('Harry Potter and the Philosopher\'s Stone');
        expect(result[3].title).toBe('The Fellowship of the Ring');
        expect(result[4].title).toBe('The Hobbit');
      });

      it('should sort filtered books by title', () => {
        const state = createMockState('Harry', 'title');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(2);
        expect(result[0].title).toBe('Harry Potter and the Chamber of Secrets');
        expect(result[1].title).toBe('Harry Potter and the Philosopher\'s Stone');
      });
    });

    describe('sorting by publishDate', () => {
      it('should sort books chronologically', () => {
        const state = createMockState('', 'publishDate');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result[0].firstPublishYear).toBe(1937);
        expect(result[1].firstPublishYear).toBe(1996);
        expect(result[2].firstPublishYear).toBe(1997);
        expect(result[3].firstPublishYear).toBe(1998);
        expect(result[4].firstPublishYear).toBe(null); // null comes last
      });

      it('should handle null publish dates', () => {
        const state = createMockState('', 'publishDate');
        const result = selectFilteredAndSortedBooks(state);
        
        const nullBook = result.find(book => book.firstPublishYear === null);
        expect(result.indexOf(nullBook)).toBe(result.length - 1);
      });
    });

    describe('sorting by notes', () => {
      it('should sort books by number of notes descending', () => {
        const notes = {
          '/works/1': [
            { id: '1', text: 'Note 1', timestamp: Date.now() },
            { id: '2', text: 'Note 2', timestamp: Date.now() },
          ],
          '/works/3': [
            { id: '3', text: 'Note 3', timestamp: Date.now() },
          ],
        };
        const state = createMockState('', 'notes', notes);
        const result = selectFilteredAndSortedBooks(state);
        
        // /works/1 has 2 notes (most)
        expect(result[0].key).toBe('/works/1');
        // /works/3 has 1 note
        expect(result[1].key).toBe('/works/3');
        // Others have 0 notes
      });

      it('should handle books with no notes', () => {
        const state = createMockState('', 'notes');
        const result = selectFilteredAndSortedBooks(state);
        
        // All books have 0 notes, should be sorted by title as tiebreaker
        expect(result).toHaveLength(5);
      });

      it('should sort filtered books by notes', () => {
        const notes = {
          '/works/1': [
            { id: '1', text: 'Note 1', timestamp: Date.now() },
          ],
          '/works/2': [
            { id: '2', text: 'Note 2', timestamp: Date.now() },
            { id: '3', text: 'Note 3', timestamp: Date.now() },
          ],
        };
        const state = createMockState('Harry', 'notes', notes);
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(2);
        // /works/2 has 2 notes
        expect(result[0].key).toBe('/works/2');
        // /works/1 has 1 note
        expect(result[1].key).toBe('/works/1');
      });
    });

    describe('combined filtering and sorting', () => {
      it('should filter then sort by title', () => {
        const state = createMockState('Ring', 'title');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('The Fellowship of the Ring');
      });

      it('should filter then sort by publish date', () => {
        const state = createMockState('Harry', 'publishDate');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(2);
        expect(result[0].firstPublishYear).toBe(1997);
        expect(result[1].firstPublishYear).toBe(1998);
      });

      it('should return empty array when no matches', () => {
        const state = createMockState('nonexistent book', 'title');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(0);
      });
    });
  });
});
