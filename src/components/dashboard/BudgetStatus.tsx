import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Budget } from '@/types/finance';
import { AlertTriangle } from 'lucide-react';

interface BudgetStatusProps {
  budget: Budget | undefined;
  currentExpenses: number;
}

export function BudgetStatus({ budget, currentExpenses }: BudgetStatusProps) {
  if (!budget) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No budget set for this month</p>
        </CardContent>
      </Card>
    );
  }

  const percentage = Math.min((currentExpenses / budget.limit) * 100, 100);
  const isWarning = percentage >= 80;
  const remaining = budget.limit - currentExpenses;

  return (
    <Card className={isWarning ? 'border-destructive/50' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          Monthly Budget
          {isWarning && <AlertTriangle className="h-4 w-4 text-destructive" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>₹{currentExpenses.toLocaleString('en-IN')} spent</span>
            <span className="text-muted-foreground">of ₹{budget.limit.toLocaleString('en-IN')}</span>
          </div>
          <Progress 
            value={percentage} 
            className={isWarning ? '[&>div]:bg-destructive' : ''} 
          />
          <p className={`text-sm ${remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {remaining >= 0 
              ? `₹${remaining.toLocaleString('en-IN')} remaining`
              : `₹${Math.abs(remaining).toLocaleString('en-IN')} over budget`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
