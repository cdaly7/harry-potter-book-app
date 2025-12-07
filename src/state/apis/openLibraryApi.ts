import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Book {
  key: string;
  title: string;
  author: string;
  coverImageId?: number;
  firstPublishYear?: number;
  isbn?: string;
}

export interface BookDetails {
  key: string;
  title: string;
  description: string;
  coverId?: number;
  subjects: string[];
  created?: string;
}

interface SearchBooksResponse {
  docs: Array<{
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    isbn?: string[];
  }>;
}

interface BookDetailsResponse {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  created?: { value: string };
}

export const openLibraryApi = createApi({
  reducerPath: 'openLibraryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://openlibrary.org' }),
  endpoints: (builder) => ({
    searchBooks: builder.query<Book[], void>({
      query: () => '/search.json?title=Harry Potter&author=J.K. Rowling',
      transformResponse: (response: SearchBooksResponse) => {
        // Filter and format the books data
        return response.docs.map(book => ({
          key: book.key,
          title: book.title,
          author: book.author_name?.[0] || 'J.K. Rowling',
          coverImageId: book.cover_i,
          firstPublishYear: book.first_publish_year,
          isbn: book.isbn?.[0],
        }));
      },
    }),
    getBookDetails: builder.query<BookDetails, string>({
      query: (workKey: string) => `${workKey}.json`,
      transformResponse: (response: BookDetailsResponse) => {
        return {
          key: response.key,
          title: response.title,
          description: typeof response.description === 'string' 
            ? response.description 
            : response.description?.value || 'No description available',
          coverId: response.covers?.[0],
          subjects: response.subjects || [],
          created: response.created?.value,
        };
      },
    }),
    getAuthorDetails: builder.query<unknown, string>({
      query: (authorKey: string) => `${authorKey}.json`,
    }),
  }),
});

export const { 
  useSearchBooksQuery, 
  useGetBookDetailsQuery,
  useGetAuthorDetailsQuery,
} = openLibraryApi;
