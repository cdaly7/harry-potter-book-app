import notesReducer, { addNote, deleteNote } from './slice';

describe('notesSlice', () => {
  const initialState = {
    notesByBook: {},
  };

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(notesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('addNote', () => {
      it('should add a note to a new book', () => {
        const bookKey = '/works/OL12345W';
        const text = 'This is a great book!';
        
        const actual = notesReducer(
          initialState,
          addNote({ bookKey, text })
        );

        expect(actual.notesByBook[bookKey]).toHaveLength(1);
        expect(actual.notesByBook[bookKey][0].text).toBe(text);
        expect(actual.notesByBook[bookKey][0].dateCreated).toBeDefined();
      });

      it('should add a note to an existing book with notes', () => {
        const bookKey = '/works/OL12345W';
        const existingState = {
          notesByBook: {
            [bookKey]: [
              { text: 'First note', dateCreated: '2025-12-06T10:00:00.000Z' },
            ],
          },
        };

        const actual = notesReducer(
          existingState,
          addNote({ bookKey, text: 'Second note' })
        );

        expect(actual.notesByBook[bookKey]).toHaveLength(2);
        expect(actual.notesByBook[bookKey][1].text).toBe('Second note');
      });

      it('should add notes with valid ISO date strings', () => {
        const bookKey = '/works/OL12345W';
        const text = 'Test note';
        
        const actual = notesReducer(
          initialState,
          addNote({ bookKey, text })
        );

        const dateCreated = actual.notesByBook[bookKey][0].dateCreated;
        expect(() => new Date(dateCreated)).not.toThrow();
        expect(new Date(dateCreated).toISOString()).toBe(dateCreated);
      });
    });

    describe('deleteNote', () => {
      it('should delete a note at the specified index', () => {
        const bookKey = '/works/OL12345W';
        const existingState = {
          notesByBook: {
            [bookKey]: [
              { text: 'First note', dateCreated: '2025-12-06T10:00:00.000Z' },
              { text: 'Second note', dateCreated: '2025-12-06T11:00:00.000Z' },
              { text: 'Third note', dateCreated: '2025-12-06T12:00:00.000Z' },
            ],
          },
        };

        const actual = notesReducer(
          existingState,
          deleteNote({ bookKey, noteIndex: 1 })
        );

        expect(actual.notesByBook[bookKey]).toHaveLength(2);
        expect(actual.notesByBook[bookKey][0].text).toBe('First note');
        expect(actual.notesByBook[bookKey][1].text).toBe('Third note');
      });

      it('should handle deleting the last note', () => {
        const bookKey = '/works/OL12345W';
        const existingState = {
          notesByBook: {
            [bookKey]: [
              { text: 'Only note', dateCreated: '2025-12-06T10:00:00.000Z' },
            ],
          },
        };

        const actual = notesReducer(
          existingState,
          deleteNote({ bookKey, noteIndex: 0 })
        );

        expect(actual.notesByBook[bookKey]).toHaveLength(0);
      });

      it('should not throw error when book key does not exist', () => {
        const bookKey = '/works/OL99999W';
        
        expect(() => {
          notesReducer(
            initialState,
            deleteNote({ bookKey, noteIndex: 0 })
          );
        }).not.toThrow();
      });

      it('should preserve notes for other books', () => {
        const bookKey1 = '/works/OL12345W';
        const bookKey2 = '/works/OL67890W';
        const existingState = {
          notesByBook: {
            [bookKey1]: [
              { text: 'Book 1 note', dateCreated: '2025-12-06T10:00:00.000Z' },
            ],
            [bookKey2]: [
              { text: 'Book 2 note', dateCreated: '2025-12-06T11:00:00.000Z' },
            ],
          },
        };

        const actual = notesReducer(
          existingState,
          deleteNote({ bookKey: bookKey1, noteIndex: 0 })
        );

        expect(actual.notesByBook[bookKey1]).toHaveLength(0);
        expect(actual.notesByBook[bookKey2]).toHaveLength(1);
        expect(actual.notesByBook[bookKey2][0].text).toBe('Book 2 note');
      });
    });
  });
});
