import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import BookDetails from './BookDetails';
import { openLibraryApi } from '../../state/apis/openLibraryApi';
import notesReducer from '../../state/notes/slice';
import userEvent from '@testing-library/user-event';

// Mock the API service
jest.mock('../../state/apis/openLibraryApi', () => ({
  openLibraryApi: {
    reducerPath: 'openLibraryApi',
    reducer: (state = {}) => state,
    middleware: (store) => (next) => (action) => next(action),
    endpoints: {
      getBookDetails: {
        useQuery: jest.fn(),
      },
    },
  },
  useGetBookDetailsQuery: jest.fn(),
}));

const { useGetBookDetailsQuery } = require('../../state/apis/openLibraryApi');

const mockBookDetails = {
  key: '/works/OL82563W',
  title: "Harry Potter and the Philosopher's Stone",
  description: 'A young wizard begins his magical education at Hogwarts School of Witchcraft and Wizardry.',
  coverId: 8739161,
  subjects: ['Fantasy', 'Magic', 'Wizards', 'Hogwarts'],
  created: '2008-04-01T03:28:50.625462',
};

const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    initialEntries = ['/book/works/OL82563W'],
    store = configureStore({
      reducer: {
        [openLibraryApi.reducerPath]: openLibraryApi.reducer,
        notes: notesReducer,
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
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/book/works/:workKey" element={children} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('BookDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    useGetBookDetailsQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });

    renderWithProviders(<BookDetails />);
    expect(screen.getByText(/loading book details/i)).toBeInTheDocument();
  });

  it('should render book details after loading', async () => {
    useGetBookDetailsQuery.mockReturnValue({
      data: mockBookDetails,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.getByText("Harry Potter and the Philosopher's Stone")).toBeInTheDocument();
      expect(screen.getByText('By J.K. Rowling')).toBeInTheDocument();
      expect(screen.getByText(/A young wizard begins his magical education/i)).toBeInTheDocument();
    });
  });

  it('should render book cover with correct src', async () => {
    useGetBookDetailsQuery.mockReturnValue({
      data: mockBookDetails,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute(
        'src',
        'https://covers.openlibrary.org/b/id/8739161-L.jpg'
      );
    });
  });

  it('should render subjects', async () => {
    useGetBookDetailsQuery.mockReturnValue({
      data: mockBookDetails,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.getByText('Fantasy')).toBeInTheDocument();
      expect(screen.getByText('Magic')).toBeInTheDocument();
      expect(screen.getByText('Wizards')).toBeInTheDocument();
      expect(screen.getByText('Hogwarts')).toBeInTheDocument();
    });
  });

  it('should render created date', async () => {
    useGetBookDetailsQuery.mockReturnValue({
      data: mockBookDetails,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.getByText(/created:/i)).toBeInTheDocument();
    });
  });

  it('should render error state when API fails', async () => {
    useGetBookDetailsQuery.mockReturnValue({
      data: undefined,
      error: { message: 'Network error' },
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.getByText(/error loading book details/i)).toBeInTheDocument();
    });
  });

  it('should handle books without cover images', async () => {
    const bookWithoutCover = { ...mockBookDetails, coverId: null };

    useGetBookDetailsQuery.mockReturnValue({
      data: bookWithoutCover,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.getByText('No Cover Available')).toBeInTheDocument();
    });
  });

  it('should render back button', async () => {
    useGetBookDetailsQuery.mockReturnValue({
      data: mockBookDetails,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.getByText(/back to list/i)).toBeInTheDocument();
    });
  });

  it('should render Notes component', async () => {
    useGetBookDetailsQuery.mockReturnValue({
      data: mockBookDetails,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.getByText('My Notes')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/write your note here/i)).toBeInTheDocument();
    });
  });

  it('should handle books without subjects', async () => {
    const bookWithoutSubjects = { ...mockBookDetails, subjects: [] };

    useGetBookDetailsQuery.mockReturnValue({
      data: bookWithoutSubjects,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.queryByText('Subjects')).not.toBeInTheDocument();
    });
  });

  it('should limit subjects to first 10', async () => {
    const bookWithManySubjects = {
      ...mockBookDetails,
      subjects: Array.from({ length: 15 }, (_, i) => `Subject ${i + 1}`),
    };

    useGetBookDetailsQuery.mockReturnValue({
      data: bookWithManySubjects,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    await waitFor(() => {
      expect(screen.getByText('Subject 1')).toBeInTheDocument();
      expect(screen.getByText('Subject 10')).toBeInTheDocument();
      expect(screen.queryByText('Subject 11')).not.toBeInTheDocument();
    });
  });
});
