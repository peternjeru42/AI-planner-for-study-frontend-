import { ArrowDown, ArrowUp } from 'lucide-react';
import { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  accent?: 'primary' | 'accent' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  accent = 'primary',
}) => {
  const accentClasses = {
    primary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent/12 text-accent',
    neutral: 'bg-muted text-foreground',
  };

  return (
    <Card className={cn('border-border/70 bg-card shadow-sm', className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
              {trend && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${trend.isPositive ? 'text-primary' : 'text-destructive'}`}>
                  {trend.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {trend.value}%
                </div>
              )}
            </div>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {icon ? <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-md', accentClasses[accent])}>{icon}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
};
