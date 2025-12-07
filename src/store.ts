import { configureStore } from '@reduxjs/toolkit';
import { openLibraryApi } from './state/apis/openLibraryApi';
import notesReducer from './state/notes/slice';
import bookListReducer from './components/book-list/slice';

export const store = configureStore({
  reducer: {
    [openLibraryApi.reducerPath]: openLibraryApi.reducer,
    notes: notesReducer,
    bookList: bookListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(openLibraryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
