import type { ErrorInfo } from 'react';
/**
 * Global error handler for logging errors to console
 */
export const logError = (error: Error, errorInfo: ErrorInfo) => {
  console.error('Error caught by boundary:', error);
  if (errorInfo.componentStack) {
    console.error('Component stack:', errorInfo.componentStack);
  }
};
