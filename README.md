# Harry Potter Books App

A React application built with Vite, Redux Toolkit Query (RTK Query), and React Router that allows users to browse Harry Potter books, view detailed information, and create notes about them.

## Features

### 1. Book List View
- Displays all Harry Potter books by J.K. Rowling
- Shows cover art and book titles
- Fetches data from OpenLibrary API
- Grid layout with hover effects

### 2. Book Details View
- Detailed information about each book including:
  - Cover art
  - Title
  - Author
  - Published date
  - Description
  - Subjects/tags
- Navigate back to the book list

### 3. Notes Feature
- Create notes for each book
- Notes include text content and timestamp
- Notes are stored in-memory during the app session
- Delete notes functionality
- Notes persist while navigating between books

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Router** - Client-side routing
- **OpenLibrary API** - Book data source
- **Jest & React Testing Library** - Testing framework

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5174/`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── book-list/
│   │   ├── BookList.tsx        # Book list view with grid layout
│   │   ├── BookList.css
│   │   └── BookList.test.jsx
│   ├── book-details/
│   │   ├── BookDetails.tsx     # Detailed book view
│   │   ├── BookDetails.css
│   │   └── BookDetails.test.jsx
│   └── notes/
│       ├── Notes.tsx           # Notes component
│       ├── Notes.css
│       └── Notes.test.jsx
├── features/
│   └── notes/
│       ├── notesSlice.ts       # Redux slice for notes management
│       └── notesSlice.test.js
├── services/
│   └── openLibraryApi.ts       # RTK Query API service with types
├── App.tsx                     # Main app component with routing
├── App.css
├── main.tsx                    # App entry point
├── index.css
├── store.ts                    # Redux store configuration with types
└── setupTests.js               # Test environment setup
```

## API Integration

The app uses the [OpenLibrary API](https://openlibrary.org/developers/api) to fetch book data:

- **Search endpoint**: `/search.json?title=Harry Potter&author=J.K. Rowling`
- **Works endpoint**: `/works/{workKey}.json` for detailed book information

## State Management

- **RTK Query**: Handles API calls, caching, and automatic refetching
- **Redux Slice**: Manages notes state in-memory
- Notes are stored per book using the book's work key as identifier

## TypeScript Implementation

The entire application is written in TypeScript, providing:
- **Type Safety**: Compile-time error detection
- **Better IDE Support**: IntelliSense and autocomplete
- **Self-Documenting Code**: Interfaces define data structures
- **Refactoring Confidence**: Type checking across the codebase

Key type definitions:
- `Book` - Book search results interface
- `BookDetails` - Detailed book information interface
- `Note` - Individual note structure
- `NotesState` - Redux notes state interface
- `RootState` - Complete Redux store state
- `AppDispatch` - Typed Redux dispatch

## Notes on Implementation

- Notes are stored in Redux state and will be lost on page refresh (as per requirements)
- The app uses React Router for navigation between list and detail views
- Cover images are fetched from OpenLibrary's cover API
- Fallback UI is provided when cover images are unavailable
- Full TypeScript support with strict type checking enabled

## Testing

The project includes comprehensive Jest tests with React Testing Library:

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **notesSlice.test.js**: Redux slice unit tests
  - Tests for addNote and deleteNote actions
  - Edge cases and state management
  
- **Notes.test.jsx**: Notes component tests
  - User interactions (adding/deleting notes)
  - Form validation
  - Note display and persistence
  
- **BookList.test.jsx**: Book list component tests
  - Loading and error states
  - Book rendering with cover images
  - Navigation links
  
- **BookDetails.test.jsx**: Book details component tests
  - Detail page rendering
  - Subject tags display
  - Notes integration

### Test Structure

Tests follow best practices:
- Mock RTK Query API calls
- Test user interactions with userEvent
- Check accessibility with appropriate queries
- Validate Redux state changes

## Future Enhancements

- Add persistent storage for notes (localStorage/backend)
- Implement search and filter functionality
- Add pagination for large book lists
- Export notes functionality
- Dark mode support
- Increase test coverage for API error scenarios
