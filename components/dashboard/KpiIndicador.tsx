// components/dashboard/KpiChangeIndicator.tsx
'use client';

import { KpiChangeIndicatorProps } from '@/types'; 


const colorClasses = {
  increase: 'text-success',
  decrease: 'text-danger',
  neutral: 'text-foreground-alt',
};

export function KpiChangeIndicator({ changeData }: KpiChangeIndicatorProps) {
  const { texto, status } = changeData;
  const className = colorClasses[status] || 'text-foreground-alt';

  return (
    <p className={`text-xs ${className}`}>
      {texto} desde el mes pasado
    </p>
  );
}