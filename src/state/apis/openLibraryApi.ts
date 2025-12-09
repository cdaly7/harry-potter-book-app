import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Book {
  key: string;
  title: string;
  authors: string[];
  coverImageId?: number;
  firstPublishYear?: number;
  isbn?: string;
  language?: string[];
  editionCount?: number;
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
    author_name: string[];
    cover_i?: number;
    first_publish_year?: number;
    isbn?: string[];
    language?: string[];
    edition_count?: number;
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
      query: () => '/search.json?title=Harry Potter&author=J.K. Rowling&limit=100000',
      transformResponse: (response: SearchBooksResponse) => {
        // Filter out books without authors and books not by J.K. Rowling
        return response.docs
          .filter(book => 
            book.author_name && 
            book.author_name.length > 0 &&
            book.author_name.includes('J. K. Rowling')
          )
          .map(book => ({
            key: book.key,
            title: book.title,
            authors: book.author_name,
            coverImageId: book.cover_i,
            firstPublishYear: book.first_publish_year,
            isbn: book.isbn?.[0],
            language: book.language ?? ['eng'],
            editionCount: book.edition_count,
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

