import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { HealthStatus } from '@/types/transformer';
import { HEALTH_STATUS_CONFIG } from '@/lib/constants';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: HealthStatus;
}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant && HEALTH_STATUS_CONFIG[variant].badge,
        className
      )}
      {...props}
    />
  );
};

export { Badge };
