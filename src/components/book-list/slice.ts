import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortOption = 'title' | 'publishDate' | 'notes';

export interface BookListState {
  searchTerm: string;
  sortBy: SortOption;
}

const initialState: BookListState = {
  searchTerm: '',
  sortBy: 'title',
};

const bookListSlice = createSlice({
  name: 'bookList',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: (state) => {
      state.searchTerm = '';
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setSearchTerm, clearSearchTerm, setSortBy } = bookListSlice.actions;
export default bookListSlice.reducer;
