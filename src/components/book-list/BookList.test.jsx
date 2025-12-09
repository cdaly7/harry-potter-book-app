import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import BookList from './BookList';
import { openLibraryApi } from '../../state/apis/openLibraryApi';

// Mock the API service
jest.mock('../../state/apis/openLibraryApi', () => ({
  openLibraryApi: {
    reducerPath: 'openLibraryApi',
    reducer: (state = {}) => state,
    middleware: (store) => (next) => (action) => next(action),
    endpoints: {
      searchBooks: {
        useQuery: jest.fn(),
      },
    },
  },
  useSearchBooksQuery: jest.fn(),
}));

// Mock the book selectors
jest.mock('../../state/books/selectors', () => ({
  selectAllBooks: jest.fn(),
}));

// Mock the book-list selectors
jest.mock('./selectors', () => ({
  selectSearchTerm: jest.fn(),
  selectSortBy: jest.fn(),
  selectSortDirection: jest.fn(),
  selectSelectedLanguages: jest.fn(),
  selectAvailableLanguages: jest.fn(),
  selectFilteredAndSortedBooks: jest.fn(),
}));

// Mock the book-list slice
jest.mock('./slice', () => ({
  setSearchTerm: jest.fn((term) => ({ type: 'bookList/setSearchTerm', payload: term })),
  clearSearchTerm: jest.fn(() => ({ type: 'bookList/clearSearchTerm' })),
  setSortBy: jest.fn((sortBy) => ({ type: 'bookList/setSortBy', payload: sortBy })),
}));

// Mock book data
const mockBooks = [
  {
    key: '/works/OL82563W',
    title: "Harry Potter and the Philosopher's Stone",
    authors: ['J.K. Rowling'],
    coverImageId: 8739161,
    firstPublishYear: 1997,
    language: ['eng'],
  },
  {
    key: '/works/OL82564W',
    title: 'Harry Potter and the Chamber of Secrets',
    authors: ['J.K. Rowling'],
    coverImageId: 8739162,
    firstPublishYear: 1998,
    language: ['eng'],
  },
];

const { useSearchBooksQuery } = require('../../state/apis/openLibraryApi');
const { selectAllBooks } = require('../../state/books/selectors');
const { selectSearchTerm, selectSortBy, selectSortDirection, selectSelectedLanguages, selectAvailableLanguages, selectFilteredAndSortedBooks } = require('./selectors');
const { setSearchTerm, clearSearchTerm, setSortBy } = require('./slice');

// Helper function to render with providers
const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        [openLibraryApi.reducerPath]: openLibraryApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('BookList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    selectAllBooks.mockReturnValue(mockBooks);
    selectSearchTerm.mockReturnValue('');
    selectSortBy.mockReturnValue('title');
    selectSortDirection.mockReturnValue('asc');
    selectSelectedLanguages.mockReturnValue([]);
    selectAvailableLanguages.mockReturnValue(['eng']);
    selectFilteredAndSortedBooks.mockReturnValue(mockBooks);
  });

  it('should render loading state initially', () => {
    useSearchBooksQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });
    selectAllBooks.mockReturnValue(undefined);

    renderWithProviders(<BookList />);
    expect(screen.getByText(/loading harry potter books/i)).toBeInTheDocument();
  });

  it('should render book list after loading', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });
    selectAllBooks.mockReturnValue(mockBooks);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(screen.getByText("Harry Potter and the Philosopher's Stone")).toBeInTheDocument();
      expect(screen.getByText('Harry Potter and the Chamber of Secrets')).toBeInTheDocument();
    });
  });

  it('should render book covers with correct src', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookList />);

    await waitFor(() => {
      const bookCover = screen.getByAltText("Harry Potter and the Philosopher's Stone");
      expect(bookCover).toHaveAttribute(
        'src',
        'https://covers.openlibrary.org/b/id/8739161-M.jpg'
      );
    });
  });

  it('should render author names', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookList />);

    await waitFor(() => {
      const authorElements = screen.getAllByText('J.K. Rowling');
      expect(authorElements.length).toBeGreaterThan(0);
    });
  });

  it('should render first published year', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(screen.getByText(/first published: 1997/i)).toBeInTheDocument();
      expect(screen.getByText(/first published: 1998/i)).toBeInTheDocument();
    });
  });

  it('should render links to book detail pages', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookList />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/book/works/OL82563W');
      expect(links[1]).toHaveAttribute('href', '/book/works/OL82564W');
    });
  });

  it('should render error state when API fails', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: undefined,
      error: { message: 'Network error' },
      isLoading: false,
    });

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(screen.getByText(/error loading books/i)).toBeInTheDocument();
    });
  });

  it('should handle books without cover images', async () => {
    const booksWithoutCovers = [
      {
        key: '/works/OL82563W',
        title: "Harry Potter and the Philosopher's Stone",
        author: 'J.K. Rowling',
        coverImageId: null,
        firstPublishYear: 1997,
      },
    ];

    useSearchBooksQuery.mockReturnValue({
      data: booksWithoutCovers,
      error: null,
      isLoading: false,
    });
    
    selectAllBooks.mockReturnValue(booksWithoutCovers);
    selectFilteredAndSortedBooks.mockReturnValue(booksWithoutCovers);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      // When there's no cover, the image src should still be set (to a broken link or placeholder)
      expect(screen.getByText("Harry Potter and the Philosopher's Stone")).toBeInTheDocument();
    });
  });

  it('should render the banner image', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookList />);

    await waitFor(() => {
      const banner = screen.getByAltText('Harry Potter Books by J.K. Rowling');
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveClass('banner-image');
    });
  });

  it('should render search input in sidebar', () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookList />);

    const searchInput = screen.getByPlaceholderText(/search by title/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should dispatch setSearchTerm action when search term is entered', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookList />);
    const searchInput = screen.getByPlaceholderText(/search by title/i);

    // Initially should show all books
    expect(screen.getByText("Harry Potter and the Philosopher's Stone")).toBeInTheDocument();
    expect(screen.getByText('Harry Potter and the Chamber of Secrets')).toBeInTheDocument();

    // Type in search
    await userEvent.type(searchInput, 'Chamber');

    // Check that setSearchTerm action was dispatched for each character typed
    await waitFor(() => {
      expect(setSearchTerm).toHaveBeenCalled();
      // Verify at least one call had the character
      expect(setSearchTerm.mock.calls.some(call => call[0].length > 0)).toBe(true);
    });
  });

  it('should show clear button when search has text', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });
    
    // Start with search term present
    selectSearchTerm.mockReturnValue('test');

    renderWithProviders(<BookList />);

    // Clear button should be visible
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });

  it('should clear search when clear button is clicked', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });
    
    // Start with a search term
    selectSearchTerm.mockReturnValue('test');

    renderWithProviders(<BookList />);
    
    // Click clear button
    const clearButton = screen.getByLabelText(/clear search/i);
    await userEvent.click(clearButton);

    // Verify clearSearchTerm action was dispatched
    expect(clearSearchTerm).toHaveBeenCalled();
  });

  it('should show results count when searching', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    selectSearchTerm.mockReturnValue('Philosopher');
    selectFilteredAndSortedBooks.mockReturnValue([mockBooks[0]]);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(screen.getByText(/found 1 book matching "Philosopher"/i)).toBeInTheDocument();
    });
  });

  it('should show no results message when no books match search', async () => {
    useSearchBooksQuery.mockReturnValue({
      data: mockBooks,
      error: null,
      isLoading: false,
    });

    selectSearchTerm.mockReturnValue('NonExistent');
    selectFilteredAndSortedBooks.mockReturnValue([]);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(screen.getByText(/no books found matching "NonExistent"/i)).toBeInTheDocument();
    });
  });

  describe('Sort functionality', () => {
    it('should render sort dropdown in sidebar', () => {
      useSearchBooksQuery.mockReturnValue({
        data: mockBooks,
        error: null,
        isLoading: false,
      });

      renderWithProviders(<BookList />);

      const sortSelect = screen.getByLabelText(/sort books/i);
      expect(sortSelect).toBeInTheDocument();
    });

    it('should have all sort options', () => {
      useSearchBooksQuery.mockReturnValue({
        data: mockBooks,
        error: null,
        isLoading: false,
      });

      renderWithProviders(<BookList />);

      const sortSelect = screen.getByLabelText(/sort books/i);
      const options = sortSelect.querySelectorAll('option');
      
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue('title');
      expect(options[0]).toHaveTextContent(/Title/);
      expect(options[1]).toHaveValue('publishDate');
      expect(options[1]).toHaveTextContent('Publish Date');
      expect(options[2]).toHaveValue('editionCount');
      expect(options[2]).toHaveTextContent('Edition Count');
    });

    it('should display current sort option', () => {
      useSearchBooksQuery.mockReturnValue({
        data: mockBooks,
        error: null,
        isLoading: false,
      });
      
      selectSortBy.mockReturnValue('publishDate');

      renderWithProviders(<BookList />);

      const sortSelect = screen.getByLabelText(/sort books/i);
      expect(sortSelect).toHaveValue('publishDate');
    });

    it('should dispatch setSortBy when sort option changes', async () => {
      useSearchBooksQuery.mockReturnValue({
        data: mockBooks,
        error: null,
        isLoading: false,
      });

      renderWithProviders(<BookList />);

      const sortSelect = screen.getByLabelText(/sort books/i);
      await userEvent.selectOptions(sortSelect, 'publishDate');

      await waitFor(() => {
        expect(setSortBy).toHaveBeenCalledWith('publishDate');
      });
    });

    it('should display books when sorted', () => {
      useSearchBooksQuery.mockReturnValue({
        data: mockBooks,
        error: null,
        isLoading: false,
      });
      
      selectSortBy.mockReturnValue('publishDate');
      selectFilteredAndSortedBooks.mockReturnValue(mockBooks);

      renderWithProviders(<BookList />);

      // Should render both books
      expect(screen.getByText("Harry Potter and the Philosopher's Stone")).toBeInTheDocument();
      expect(screen.getByText('Harry Potter and the Chamber of Secrets')).toBeInTheDocument();
    });
  });
});
