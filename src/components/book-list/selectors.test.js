import {
  selectSearchTerm,
  selectSortBy,
  selectSortDirection,
  selectFilteredAndSortedBooks,
} from './selectors';

describe('BookList Selectors', () => {
  const mockBooks = [
    { 
      key: '/works/1', 
      title: 'Harry Potter and the Philosopher\'s Stone', 
      firstPublishYear: 1997,
      authors: ['J.K. Rowling'],
      language: ['eng']
    },
    { 
      key: '/works/2', 
      title: 'Harry Potter and the Chamber of Secrets', 
      firstPublishYear: 1998,
      authors: ['J.K. Rowling'],
      language: ['eng', 'spa']
    },
    { 
      key: '/works/3', 
      title: 'Harry Potter and the Prisoner of Azkaban', 
      firstPublishYear: 1999,
      authors: ['J.K. Rowling'],
      language: ['eng']
    },
    { 
      key: '/works/4', 
      title: 'Harry Potter and the Goblet of Fire', 
      firstPublishYear: 2000,
      authors: ['J.K. Rowling'],
      language: ['eng', 'fre']
    },
    { 
      key: '/works/5', 
      title: 'Harry Potter and the Order of the Phoenix', 
      firstPublishYear: null, // Test null publish date
      authors: ['J.K. Rowling'],
      language: ['eng']
    },
  ];

  const createMockState = (searchTerm = '', sortBy = 'title', sortDirection = 'asc', selectedLanguages = [], notes = {}) => ({
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
      sortDirection,
      selectedLanguages,
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

  describe('selectSortDirection', () => {
    it('should return the sort direction from state', () => {
      const state = createMockState('', 'title', 'desc');
      expect(selectSortDirection(state)).toBe('desc');
    });

    it('should return asc by default', () => {
      const state = createMockState('', 'title', 'asc');
      expect(selectSortDirection(state)).toBe('asc');
    });
  });

  describe('selectFilteredAndSortedBooks', () => {
    describe('sorting by title', () => {
      it('should sort books alphabetically by title', () => {
        const state = createMockState('', 'title');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result[0].title).toBe('Harry Potter and the Chamber of Secrets');
        expect(result[1].title).toBe('Harry Potter and the Goblet of Fire');
        expect(result[2].title).toBe('Harry Potter and the Order of the Phoenix');
        expect(result[3].title).toBe('Harry Potter and the Philosopher\'s Stone');
        expect(result[4].title).toBe('Harry Potter and the Prisoner of Azkaban');
      });

      it('should sort filtered books by title', () => {
        const state = createMockState('Goblet', 'title');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Harry Potter and the Goblet of Fire');
      });
    });

    describe('sorting by publishDate', () => {
      it('should sort books chronologically', () => {
        const state = createMockState('', 'publishDate');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result[0].firstPublishYear).toBe(1997);
        expect(result[1].firstPublishYear).toBe(1998);
        expect(result[2].firstPublishYear).toBe(1999);
        expect(result[3].firstPublishYear).toBe(2000);
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
        const state = createMockState('', 'notes', 'desc', [], notes);
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
        const state = createMockState('Stone', 'notes', 'desc', notes);
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(1);
        // Only /works/1 (Philosopher's Stone) matches the search
        expect(result[0].key).toBe('/works/1');
      });
    });

    describe('combined filtering and sorting', () => {
      it('should filter then sort by title', () => {
        const state = createMockState('Prisoner', 'title');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Harry Potter and the Prisoner of Azkaban');
      });

      it('should filter then sort by publish date', () => {
        const state = createMockState('Chamber', 'publishDate');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(1);
        expect(result[0].firstPublishYear).toBe(1998);
      });

      it('should return empty array when no matches', () => {
        const state = createMockState('nonexistent book', 'title');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result).toHaveLength(0);
      });
    });

    describe('descending sort direction', () => {
      it('should sort books by title in descending order', () => {
        const state = createMockState('', 'title', 'desc');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result[0].title).toBe('Harry Potter and the Prisoner of Azkaban');
        expect(result[1].title).toBe('Harry Potter and the Philosopher\'s Stone');
        expect(result[2].title).toBe('Harry Potter and the Order of the Phoenix');
        expect(result[3].title).toBe('Harry Potter and the Goblet of Fire');
        expect(result[4].title).toBe('Harry Potter and the Chamber of Secrets');
      });

      it('should sort books by publish date in descending order', () => {
        const state = createMockState('', 'publishDate', 'desc');
        const result = selectFilteredAndSortedBooks(state);
        
        expect(result[0].firstPublishYear).toBe(null); // null comes first in desc
        expect(result[1].firstPublishYear).toBe(2000);
        expect(result[2].firstPublishYear).toBe(1999);
        expect(result[3].firstPublishYear).toBe(1998);
        expect(result[4].firstPublishYear).toBe(1997);
      });

      it('should sort books by notes in descending order', () => {
        const notes = {
          '/works/1': [
            { id: '1', text: 'Note 1', timestamp: Date.now() },
            { id: '2', text: 'Note 2', timestamp: Date.now() },
          ],
          '/works/3': [
            { id: '3', text: 'Note 3', timestamp: Date.now() },
          ],
        };
        const state = createMockState('', 'notes', 'desc', [], notes);
        const result = selectFilteredAndSortedBooks(state);
        
        // With desc, books with more notes come first
        // /works/1 has 2 notes (most), /works/3 has 1 note, others have 0
        expect(result[0].key).toBe('/works/1');
        expect(result[1].key).toBe('/works/3');
        // Others have 0 notes
      });
    });
  });
});
