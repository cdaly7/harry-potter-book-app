import { selectAllBooks } from './selectors';

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

  const createMockState = (books) => ({
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
  });

  describe('selectAllBooks', () => {
    it('should return all books from the API cache', () => {
      const state = createMockState(mockBooks);
      const result = selectAllBooks(state);
      expect(result).toEqual(mockBooks);
      expect(result).toHaveLength(3);
    });

    it('should return undefined when no books are loaded', () => {
      const state = createMockState(undefined);
      const result = selectAllBooks(state);
      expect(result).toBeUndefined();
    });
  });
});
