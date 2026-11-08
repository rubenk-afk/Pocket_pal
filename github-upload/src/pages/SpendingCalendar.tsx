import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinanceData } from '@/hooks/useFinanceData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { cn } from '@/lib/utils';

export default function SpendingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { transactions, getDailySpending } = useFinanceData();

  // Calculate daily spending for the current month
  const dailySpending = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const spending = getDailySpending(dateStr);
      return { date: day, dateStr, spending };
    });
  }, [currentDate, transactions, getDailySpending]);

  // Calculate spending thresholds for color coding
  const spendingValues = dailySpending.map(d => d.spending).filter(s => s > 0);
  const maxSpending = Math.max(...spendingValues, 1);
  const avgSpending = spendingValues.length > 0 
    ? spendingValues.reduce((a, b) => a + b, 0) / spendingValues.length 
    : 0;

  const getSpendingColor = (spending: number) => {
    if (spending === 0) return 'bg-muted/30';
    const ratio = spending / maxSpending;
    if (ratio <= 0.33) return 'bg-green-500/20 text-green-700';
    if (ratio <= 0.66) return 'bg-yellow-500/20 text-yellow-700';
    return 'bg-red-500/20 text-red-700';
  };

  // Get calendar grid with padding for start of month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const totalMonthSpending = dailySpending.reduce((sum, d) => sum + d.spending, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Spending Calendar</h1>
        <p className="text-muted-foreground">View your daily spending at a glance</p>
      </div>

      {/* Month Navigation */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayData = dailySpending.find(d => d.dateStr === dateStr);
              const spending = dayData?.spending || 0;
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dateStr}
                  className={cn(
                    "aspect-square p-1 rounded-lg flex flex-col items-center justify-center transition-colors",
                    isCurrentMonth ? getSpendingColor(spending) : 'opacity-30',
                    isToday && 'ring-2 ring-primary'
                  )}
                >
                  <span className={cn(
                    "text-xs",
                    !isCurrentMonth && 'text-muted-foreground'
                  )}>
                    {format(day, 'd')}
                  </span>
                  {isCurrentMonth && spending > 0 && (
                    <span className="text-[10px] font-medium mt-0.5">
                      ₹{spending >= 1000 ? `${(spending / 1000).toFixed(1)}k` : spending}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend & Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Color Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/20" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500/20" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/20" />
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Month Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Spent:</span>
                <span className="font-medium">₹{totalMonthSpending.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Daily:</span>
                <span className="font-medium">
                  ₹{spendingValues.length > 0 ? Math.round(avgSpending).toLocaleString('en-IN') : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days with Spending:</span>
                <span className="font-medium">{spendingValues.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
