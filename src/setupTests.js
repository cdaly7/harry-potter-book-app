import '@testing-library/jest-dom';
import fetch, { Request, Response, Headers } from 'cross-fetch';

// Polyfill fetch for Node.js environment
global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
