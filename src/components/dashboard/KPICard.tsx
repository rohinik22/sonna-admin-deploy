import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  className
}) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className={cn("relative overflow-hidden h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground leading-tight">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-bold leading-tight">{value}</div>
          <div className="flex items-center flex-wrap gap-1">
            <Badge
              variant={isPositive ? "default" : isNegative ? "destructive" : "secondary"}
              className={cn(
                "flex items-center gap-1 text-xs px-2 py-1",
                isPositive && "bg-green-100 text-green-700 hover:bg-green-100",
                isNegative && "bg-red-100 text-red-700 hover:bg-red-100",
                trend === 'neutral' && "bg-gray-100 text-gray-700 hover:bg-gray-100"
              )}
            >
              {trend !== 'neutral' && <TrendIcon className="h-3 w-3" />}
              {change}
            </Badge>
            {trend !== 'neutral' && (
              <span className="text-xs text-muted-foreground hidden sm:inline">vs last period</span>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Subtle background gradient */}
      <div className={cn(
        "absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 opacity-5 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10",
        isPositive && "bg-green-500",
        isNegative && "bg-red-500",
        trend === 'neutral' && "bg-blue-500"
      )} />
    </Card>
  );
};

KPICard.displayName = "KPICard";
