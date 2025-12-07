import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  text: string;
  dateCreated: string;
}

export interface NotesState {
  notesByBook: {
    [bookKey: string]: Note[];
  };
}

const initialState: NotesState = {
  notesByBook: {},
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<{ bookKey: string; text: string }>) => {
      const { bookKey, text } = action.payload;
      if (!state.notesByBook[bookKey]) {
        state.notesByBook[bookKey] = [];
      }
      state.notesByBook[bookKey].push({
        text,
        dateCreated: new Date().toISOString(),
      });
    },
    deleteNote: (state, action: PayloadAction<{ bookKey: string; noteIndex: number }>) => {
      const { bookKey, noteIndex } = action.payload;
      if (state.notesByBook[bookKey]) {
        state.notesByBook[bookKey].splice(noteIndex, 1);
      }
    },
  },
});

export const { addNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
