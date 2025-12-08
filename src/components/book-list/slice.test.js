import bookListReducer, { setSearchTerm, clearSearchTerm, setSortBy, setSortDirection, toggleSortDirection, setSelectedLanguages, toggleLanguage, clearLanguageFilter } from './slice';

describe('bookListSlice', () => {
  const initialState = {
    searchTerm: '',
    sortBy: 'title',
    sortDirection: 'asc',
    selectedLanguages: [],
  };

  it('should return the initial state', () => {
    expect(bookListReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setSearchTerm', () => {
    it('should set the search term', () => {
      const searchTerm = 'Harry Potter';
      const action = setSearchTerm(searchTerm);
      const state = bookListReducer(initialState, action);
      
      expect(state.searchTerm).toBe(searchTerm);
    });

    it('should update existing search term', () => {
      const currentState = { searchTerm: 'old search' };
      const newSearchTerm = 'new search';
      const action = setSearchTerm(newSearchTerm);
      const state = bookListReducer(currentState, action);
      
      expect(state.searchTerm).toBe(newSearchTerm);
    });

    it('should handle empty string', () => {
      const currentState = { searchTerm: 'something' };
      const action = setSearchTerm('');
      const state = bookListReducer(currentState, action);
      
      expect(state.searchTerm).toBe('');
    });
  });

  describe('clearSearchTerm', () => {
    it('should clear the search term', () => {
      const currentState = { searchTerm: 'Harry Potter', sortBy: 'title', sortDirection: 'asc' };
      const action = clearSearchTerm();
      const state = bookListReducer(currentState, action);
      
      expect(state.searchTerm).toBe('');
    });

    it('should work when search term is already empty', () => {
      const action = clearSearchTerm();
      const state = bookListReducer(initialState, action);
      
      expect(state.searchTerm).toBe('');
    });
  });

  describe('setSortBy', () => {
    it('should set the sort option', () => {
      const action = setSortBy('publishDate');
      const state = bookListReducer(initialState, action);
      
      expect(state.sortBy).toBe('publishDate');
    });

    it('should update existing sort option', () => {
      const currentState = { searchTerm: '', sortBy: 'title', sortDirection: 'asc' };
      const action = setSortBy('notes');
      const state = bookListReducer(currentState, action);
      
      expect(state.sortBy).toBe('notes');
    });

    it('should handle all sort options', () => {
      let state = initialState;
      
      state = bookListReducer(state, setSortBy('title'));
      expect(state.sortBy).toBe('title');
      
      state = bookListReducer(state, setSortBy('publishDate'));
      expect(state.sortBy).toBe('publishDate');
      
      state = bookListReducer(state, setSortBy('notes'));
      expect(state.sortBy).toBe('notes');
    });
  });

  describe('setSortDirection', () => {
    it('should set the sort direction to descending', () => {
      const action = setSortDirection('desc');
      const state = bookListReducer(initialState, action);
      
      expect(state.sortDirection).toBe('desc');
    });

    it('should set the sort direction to ascending', () => {
      const currentState = { searchTerm: '', sortBy: 'title', sortDirection: 'desc' };
      const action = setSortDirection('asc');
      const state = bookListReducer(currentState, action);
      
      expect(state.sortDirection).toBe('asc');
    });
  });

  describe('toggleSortDirection', () => {
    it('should toggle from ascending to descending', () => {
      const action = toggleSortDirection();
      const state = bookListReducer(initialState, action);
      
      expect(state.sortDirection).toBe('desc');
    });

    it('should toggle from descending to ascending', () => {
      const currentState = { searchTerm: '', sortBy: 'title', sortDirection: 'desc' };
      const action = toggleSortDirection();
      const state = bookListReducer(currentState, action);
      
      expect(state.sortDirection).toBe('asc');
    });

    it('should toggle multiple times', () => {
      let state = initialState;
      
      state = bookListReducer(state, toggleSortDirection());
      expect(state.sortDirection).toBe('desc');
      
      state = bookListReducer(state, toggleSortDirection());
      expect(state.sortDirection).toBe('asc');
      
      state = bookListReducer(state, toggleSortDirection());
      expect(state.sortDirection).toBe('desc');
    });
  });

  describe('setSelectedLanguages', () => {
    it('should set selected languages', () => {
      const languages = ['eng', 'spa'];
      const action = setSelectedLanguages(languages);
      const state = bookListReducer(initialState, action);
      
      expect(state.selectedLanguages).toEqual(languages);
    });

    it('should replace existing selected languages', () => {
      const currentState = { ...initialState, selectedLanguages: ['eng'] };
      const newLanguages = ['spa', 'fre'];
      const action = setSelectedLanguages(newLanguages);
      const state = bookListReducer(currentState, action);
      
      expect(state.selectedLanguages).toEqual(newLanguages);
    });
  });

  describe('toggleLanguage', () => {
    it('should add language when not selected', () => {
      const action = toggleLanguage('eng');
      const state = bookListReducer(initialState, action);
      
      expect(state.selectedLanguages).toEqual(['eng']);
    });

    it('should remove language when already selected', () => {
      const currentState = { ...initialState, selectedLanguages: ['eng', 'spa'] };
      const action = toggleLanguage('eng');
      const state = bookListReducer(currentState, action);
      
      expect(state.selectedLanguages).toEqual(['spa']);
    });

    it('should handle multiple toggles', () => {
      let state = initialState;
      
      state = bookListReducer(state, toggleLanguage('eng'));
      expect(state.selectedLanguages).toEqual(['eng']);
      
      state = bookListReducer(state, toggleLanguage('spa'));
      expect(state.selectedLanguages).toEqual(['eng', 'spa']);
      
      state = bookListReducer(state, toggleLanguage('eng'));
      expect(state.selectedLanguages).toEqual(['spa']);
    });
  });

  describe('clearLanguageFilter', () => {
    it('should clear all selected languages', () => {
      const currentState = { ...initialState, selectedLanguages: ['eng', 'spa', 'fre'] };
      const action = clearLanguageFilter();
      const state = bookListReducer(currentState, action);
      
      expect(state.selectedLanguages).toEqual([]);
    });
  });

  describe('reducer combinations', () => {
    it('should handle multiple actions in sequence', () => {
      let state = initialState;
      
      state = bookListReducer(state, setSearchTerm('first'));
      expect(state.searchTerm).toBe('first');
      
      state = bookListReducer(state, setSortBy('notes'));
      expect(state.sortBy).toBe('notes');
      
      state = bookListReducer(state, setSearchTerm('second'));
      expect(state.searchTerm).toBe('second');
      
      state = bookListReducer(state, clearSearchTerm());
      expect(state.searchTerm).toBe('');
      expect(state.sortBy).toBe('notes'); // sortBy should remain unchanged
    });
  });
});
