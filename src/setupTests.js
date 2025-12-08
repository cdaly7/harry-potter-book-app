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

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    // Immediately trigger the callback as if element is visible
    this.callback([
      {
        isIntersecting: true,
        target,
        intersectionRatio: 1,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now(),
      },
    ]);
  }

  unobserve() {
    // no-op
  }

  disconnect() {
    // no-op
  }
};
