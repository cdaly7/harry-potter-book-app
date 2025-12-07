import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Notes from './Notes';
import notesReducer from '../../state/notes/slice';

const renderWithProviders = (
  ui,
  {
    preloadedState = {
      notes: {
        notesByBook: {},
      },
    },
    store = configureStore({
      reducer: {
        notes: notesReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('Notes', () => {
  const bookKey = '/works/OL82563W';

  it('should render notes form', () => {
    renderWithProviders(<Notes bookKey={bookKey} />);

    expect(screen.getByText('My Notes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/write your note here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
  });

  it('should display message when no notes exist', () => {
    renderWithProviders(<Notes bookKey={bookKey} />);

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it('should add a note when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Notes bookKey={bookKey} />);

    const textarea = screen.getByPlaceholderText(/write your note here/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await user.type(textarea, 'This is my first note');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('This is my first note')).toBeInTheDocument();
    });

    // Check that textarea is cleared after submission
    expect(textarea).toHaveValue('');
  });

  it('should not add empty notes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Notes bookKey={bookKey} />);

    const submitButton = screen.getByRole('button', { name: /add note/i });
    await user.click(submitButton);

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it('should not add notes with only whitespace', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Notes bookKey={bookKey} />);

    const textarea = screen.getByPlaceholderText(/write your note here/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await user.type(textarea, '   ');
    await user.click(submitButton);

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it('should display existing notes', () => {
    const preloadedState = {
      notes: {
        notesByBook: {
          [bookKey]: [
            { text: 'First note', dateCreated: '2025-12-06T10:00:00.000Z' },
            { text: 'Second note', dateCreated: '2025-12-06T11:00:00.000Z' },
          ],
        },
      },
    };

    renderWithProviders(<Notes bookKey={bookKey} />, { preloadedState });

    expect(screen.getByText('First note')).toBeInTheDocument();
    expect(screen.getByText('Second note')).toBeInTheDocument();
  });

  it('should display formatted date for each note', () => {
    const preloadedState = {
      notes: {
        notesByBook: {
          [bookKey]: [
            { text: 'Test note', dateCreated: '2025-12-06T10:00:00.000Z' },
          ],
        },
      },
    };

    renderWithProviders(<Notes bookKey={bookKey} />, { preloadedState });

    const dateElement = screen.getByText((content, element) => {
      return element?.className === 'note-date';
    });

    expect(dateElement).toBeInTheDocument();
  });

  it('should delete a note when delete button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      notes: {
        notesByBook: {
          [bookKey]: [
            { text: 'First note', dateCreated: '2025-12-06T10:00:00.000Z' },
            { text: 'Second note', dateCreated: '2025-12-06T11:00:00.000Z' },
          ],
        },
      },
    };

    renderWithProviders(<Notes bookKey={bookKey} />, { preloadedState });

    const deleteButtons = screen.getAllByRole('button', { name: /delete note/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('First note')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Second note')).toBeInTheDocument();
  });

  it('should add multiple notes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Notes bookKey={bookKey} />);

    const textarea = screen.getByPlaceholderText(/write your note here/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    // Add first note
    await user.type(textarea, 'First note');
    await user.click(submitButton);

    // Add second note
    await user.type(textarea, 'Second note');
    await user.click(submitButton);

    // Add third note
    await user.type(textarea, 'Third note');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First note')).toBeInTheDocument();
      expect(screen.getByText('Second note')).toBeInTheDocument();
      expect(screen.getByText('Third note')).toBeInTheDocument();
    });
  });

  it('should handle notes with line breaks', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Notes bookKey={bookKey} />);

    const textarea = screen.getByPlaceholderText(/write your note here/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');
    await user.click(submitButton);

    await waitFor(() => {
      const noteText = screen.getByText(/Line 1/);
      expect(noteText).toBeInTheDocument();
      expect(noteText.textContent).toContain('Line 2');
      expect(noteText.textContent).toContain('Line 3');
    });
  });

  it('should not display notes from other books', () => {
    const preloadedState = {
      notes: {
        notesByBook: {
          '/works/OTHER': [
            { text: 'Note from other book', dateCreated: '2025-12-06T10:00:00.000Z' },
          ],
        },
      },
    };

    renderWithProviders(<Notes bookKey={bookKey} />, { preloadedState });

    expect(screen.queryByText('Note from other book')).not.toBeInTheDocument();
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it('should trim whitespace from notes before adding', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Notes bookKey={bookKey} />);

    const textarea = screen.getByPlaceholderText(/write your note here/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await user.type(textarea, '  Test note with spaces  ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Test note with spaces')).toBeInTheDocument();
    });
  });
});
