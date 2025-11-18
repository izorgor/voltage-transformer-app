import { type ClassValue, clsx } from 'clsx';
import { HEALTH_STATUS_CONFIG, FALLBACK_HEALTH_COLOR } from './constants';
import type { HealthStatus } from '@/types/transformer';

/**
 * Utility function for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Gets a chart color (hex) based on transformer health status
 */
export function getHealthColor(health: string): string {
  return HEALTH_STATUS_CONFIG[health as HealthStatus]?.chartColor || FALLBACK_HEALTH_COLOR;
}
