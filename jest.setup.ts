import '@testing-library/jest-dom';

// Extend expect matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(expected: unknown): R;
    }
  }
}