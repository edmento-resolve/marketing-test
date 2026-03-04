'use client';

import * as React from 'react';
import { Tooltip, type TooltipProps } from 'recharts';

import { cn } from '@/lib/utils';

export type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
};

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, style, ...props }, ref) => {
    const cssVars = React.useMemo(() => {
      const vars = Object.entries(config).reduce(
        (acc, [key, value]) => {
          acc[`--color-${key}`] = value.color;
          return acc;
        },
        {} as Record<string, string>
      );
      return { ...vars, ...style } as React.CSSProperties;
    }, [config, style]);

    return (
      <div ref={ref} className={cn('w-full', className)} style={cssVars} {...props}>
        {children}
      </div>
    );
  }
);
ChartContainer.displayName = 'ChartContainer';

export function ChartTooltip(props: TooltipProps<number, string>) {
  return (
    <Tooltip
      {...props}
      wrapperStyle={{ outline: 'none', ...(props.wrapperStyle ?? {}) }}
    />
  );
}

type ChartTooltipContentProps = TooltipProps<number, string> & {
  hideLabel?: boolean;
  labelFormatter?: (label: string | number) => React.ReactNode;
  valueFormatter?: (payload: {
    value?: number | string;
    name?: string;
    color?: string;
    dataKey?: string | number;
    payload?: Record<string, unknown>;
  }) => React.ReactNode;
  payload?: Array<{
    value?: number | string;
    name?: string;
    color?: string;
    dataKey?: string | number;
    payload?: Record<string, unknown>;
  }>;
  label?: string | number;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  labelFormatter,
  valueFormatter,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const displayLabel = labelFormatter ? labelFormatter(label ?? '') : label;

  return (
    <div className="rounded-2xl border bg-card/95 px-3 py-2 text-xs shadow-lg">
      {!hideLabel && (
        <p className="mb-1 font-medium text-muted-foreground">{displayLabel}</p>
      )}
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey}-${index}`} className="flex items-center gap-2">
            {entry.color && (
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
            )}
            <div className="flex flex-col">
              <span className="text-muted-foreground">
                {entry.name ?? entry.dataKey}
              </span>
              <span className="font-semibold text-foreground">
                {valueFormatter ? valueFormatter(entry) : entry.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

