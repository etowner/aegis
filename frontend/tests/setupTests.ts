import '@testing-library/jest-dom/vitest';
import { server } from '@tests/mocks/server';

// Start server before all tests
beforeAll(() => server.listen())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close())

beforeEach(() => {
  window.localStorage.clear();
});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});