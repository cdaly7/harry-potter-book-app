import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortOption = 'title' | 'publishDate' | 'notes' | 'editionCount';
export type SortDirection = 'asc' | 'desc';

export interface BookListState {
  searchTerm: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
  selectedLanguages: string[];
}

const initialState: BookListState = {
  searchTerm: '',
  sortBy: 'title',
  sortDirection: 'asc',
  selectedLanguages: [],
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
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sortDirection = action.payload;
    },
    toggleSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    },
    setSelectedLanguages: (state, action: PayloadAction<string[]>) => {
      state.selectedLanguages = action.payload;
    },
    toggleLanguage: (state, action: PayloadAction<string>) => {
      const language = action.payload;
      const index = state.selectedLanguages.indexOf(language);
      if (index > -1) {
        state.selectedLanguages.splice(index, 1);
      } else {
        state.selectedLanguages.push(language);
      }
    },
    clearLanguageFilter: (state) => {
      state.selectedLanguages = [];
    },
  },
});

export const { 
  setSearchTerm, 
  clearSearchTerm, 
  setSortBy, 
  setSortDirection, 
  toggleSortDirection,
  setSelectedLanguages,
  toggleLanguage,
  clearLanguageFilter,
} = bookListSlice.actions;
export default bookListSlice.reducer;
