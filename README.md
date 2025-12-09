# Harry Potter Books App

A React application built with Vite, Redux Toolkit Query (RTK Query), and React Router that allows users to browse Harry Potter books, view detailed information, and create notes about them.

## Features

### 1. Book List View
- Displays all Harry Potter books by J.K. Rowling (filtered at API level)
- Shows cover art, book titles, and publication year
- Responsive grid layout with hover effects
- Lazy loading images with Intersection Observer for performance
- Image preloading for first 6 visible books

### 2. Advanced Filtering & Sorting
- **Search**: Debounced search by title (300ms delay)
- **Sort Options**: 
  - Title (A-Z)
  - Publish Date
  - Edition Count
- **Sort Direction**: Ascending/Descending toggle
- **Language Filter**: Multi-select language filter with checkboxes
- Live results count display

### 3. Book Details View
- Detailed information about each book including:
  - Large cover art with optimized loading
  - Title
  - Published date
  - Description
  - Subject tags (limited to 10)
- Navigate back to the book list

### 4. Notes Feature
- Create notes for each book
- Notes include text content and timestamp
- Notes are stored in Redux (in-memory during session)
- Delete notes functionality
- Notes persist while navigating between books

## Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite 6.0** - Fast build tool and dev server
- **Redux Toolkit** - State management with slices
- **RTK Query** - Data fetching, caching, and automatic refetching
- **React Router v6** - Client-side routing with v7 future flags
- **Lucide React** - Icon library
- **OpenLibrary API** - Book data source
- **Jest & React Testing Library** - Testing framework (93 tests)

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
│   │   ├── BookList.tsx          # Main book list view with filters
│   │   ├── BookList.css
│   │   ├── BookList.test.jsx
│   │   ├── BookCard.tsx          # Individual book card component
│   │   ├── selectors.ts          # Memoized selectors for filtering/sorting
│   │   ├── selectors.test.js
│   │   ├── slice.ts              # Redux slice for UI state
│   │   └── slice.test.js
│   ├── book-details/
│   │   ├── BookDetails.tsx       # Detailed book view
│   │   ├── BookDetails.css
│   │   └── BookDetails.test.jsx
│   ├── layouts/
│   │   ├── FilterSidebar.tsx     # Filter & sort sidebar
│   │   └── FilterSidebar.css
│   ├── notes/
│   │   ├── Notes.tsx             # Notes component
│   │   ├── Notes.jsx             # Legacy JS version
│   │   ├── Notes.css
│   │   └── Notes.test.jsx
│   └── ui/
│       ├── BookCover.tsx         # Reusable book cover component
│       ├── BookCover.css
│       ├── LoadingSpinner.tsx    # Loading spinner with elder wand
│       └── LoadingSpinner.css
├── hooks/
│   ├── useDebounce.ts            # Debounce hook for search
│   └── useLazyImage.ts           # Intersection Observer for lazy loading
├── state/
│   ├── apis/
│   │   └── openLibraryApi.ts     # RTK Query API definitions
│   ├── books/
│   │   ├── selectors.ts          # Book data selectors
│   │   └── selectors.test.js
│   └── notes/
│       ├── slice.ts              # Redux slice for notes
│       ├── slice.test.js
│       └── selectors.ts          # Notes selectors
├── utils/
│   └── imagePreloader.ts         # Image preloading utility
├── assets/
│   ├── harry_banner.webp         # Banner image
│   └── elder-wand.svg            # Loading spinner icon
├── App.tsx                       # Main app with routing
├── App.css
├── main.tsx                      # App entry point
├── index.css
├── store.ts                      # Redux store configuration
└── setupTests.js                 # Test setup with mocks
```

## API Integration

The app uses the [OpenLibrary API](https://openlibrary.org/developers/api) to fetch book data:

- **Search endpoint**: `/search.json?title=Harry Potter&author=J.K. Rowling`
- **Works endpoint**: `/works/{workKey}.json` for detailed book information

## State Management

### Redux Slices
- **bookList slice**: UI state for filters, search term, sort options, and selected languages
- **notes slice**: Notes storage keyed by book work key
- **openLibraryApi**: RTK Query endpoints for book data fetching

### Selectors
- **Memoized selectors** using `createSelector` for efficient filtering and sorting
- **Stable references** for empty arrays to prevent unnecessary re-renders
- **Combined selectors** for complex filtering (search + language + sort)

### Performance Optimizations
- Debounced search input (300ms delay)
- Memoized selectors to avoid recalculations
- Lazy image loading with Intersection Observer
- Image preloading for first 6 visible books

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

## Key Implementation Details

### Image Optimization
- **Lazy Loading**: Images load only when near viewport using Intersection Observer
- **Preloading**: First 6 images preloaded for instant display
- **Responsive Images**: srcSet for retina displays
- **CDN Preconnect**: DNS prefetch for OpenLibrary CDN
- **Size Optimization**: Medium (-M) images by default, large (-L) for 2x displays

### Data Filtering
- Books filtered at API level to only include J.K. Rowling as author
- Books without author data excluded
- Language filtering with multi-select checkboxes
- Debounced search for better performance

### Accessibility
- ARIA labels on all interactive elements
- ARIA live regions for dynamic content updates
- Semantic HTML (article, section, main)
- Keyboard navigation support
- Screen reader friendly

### React Router v7 Ready
- Future flags enabled: `v7_startTransition` and `v7_relativeSplatPath`
- No deprecation warnings

### Notes
- Stored in Redux state (lost on page refresh - in-memory only)
- Keyed by book work key for persistence across navigation
- Memoized selector prevents unnecessary re-renders

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