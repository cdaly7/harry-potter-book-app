import bookListReducer, { setSearchTerm, clearSearchTerm, setSortBy } from './slice';

describe('bookListSlice', () => {
  const initialState = {
    searchTerm: '',
    sortBy: 'title',
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
      const currentState = { searchTerm: 'Harry Potter', sortBy: 'title' };
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
      const currentState = { searchTerm: '', sortBy: 'title' };
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
