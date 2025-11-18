import type { HealthStatus } from '@/types/transformer';

/**
 * Health status color configuration
 * Single source of truth for all health-related colors across the app
 */
export const HEALTH_STATUS_CONFIG = {
  Excellent: {
    // Tailwind classes for Badge component
    badge: 'bg-green-100 text-green-800 border-green-200',
    chartColor: '#10b981',
  },
  Good: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    chartColor: '#3b82f6',
  },
  Fair: {
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    chartColor: '#f59e0b',
  },
  Poor: {
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    chartColor: '#f97316',
  },
  Critical: {
    badge: 'bg-red-100 text-red-800 border-red-200',
    chartColor: '#ef4444',
  },
} as const satisfies Record<HealthStatus, { badge: string; chartColor: string }>;

/**
 * Fallback color for unknown health statuses
 */
export const FALLBACK_HEALTH_COLOR = '#6b7280';
