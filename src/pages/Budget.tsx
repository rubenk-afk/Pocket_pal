import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useFinanceData } from '@/hooks/useFinanceData';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function Budget() {
  const { budgets, transactions, setBudget, getCurrentMonthExpenses, getCurrentBudget } = useFinanceData();
  const [newLimit, setNewLimit] = useState('');

  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthLabel = format(new Date(), 'MMMM yyyy');
  const currentBudget = getCurrentBudget();
  const currentExpenses = getCurrentMonthExpenses();

  const handleSetBudget = () => {
    const limit = Number(newLimit);
    if (!isNaN(limit) && limit > 0) {
      if (!setBudget(currentMonth, limit)) return;
      setNewLimit('');
    }
  };

  const percentage = currentBudget 
    ? Math.min((currentExpenses / currentBudget.limit) * 100, 100) 
    : 0;
  const isWarning = percentage >= 80;
  const isOver = currentBudget && currentExpenses > currentBudget.limit;

  // Get expense breakdown by category
  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Budget</h1>
        <p className="text-muted-foreground">Manage your monthly spending limit</p>
      </div>

      {/* Current Month Budget */}
      <Card className={isOver ? 'border-destructive' : isWarning ? 'border-yellow-500' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentMonthLabel}</span>
            {isOver && <AlertTriangle className="h-5 w-5 text-destructive" />}
            {!isOver && percentage >= 80 && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
            {!isOver && percentage < 80 && currentBudget && <CheckCircle className="h-5 w-5 text-green-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentBudget ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    ₹{currentExpenses.toLocaleString('en-IN')} spent
                  </span>
                  <span className="text-muted-foreground">
                    of ₹{currentBudget.limit.toLocaleString('en-IN')}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className={isOver ? '[&>div]:bg-destructive' : isWarning ? '[&>div]:bg-yellow-500' : ''} 
                />
              </div>

              {isWarning && !isOver && (
                <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-700 text-sm">
                  ⚠️ You've used {percentage.toFixed(0)}% of your budget. Spend wisely!
                </div>
              )}

              {isOver && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  🚨 You've exceeded your budget by ₹{(currentExpenses - currentBudget.limit).toLocaleString('en-IN')}
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Update Budget</p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="New budget limit"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                  />
                  <Button onClick={handleSetBudget}>Update</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">No budget set for this month</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter budget limit"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                />
                <Button onClick={handleSetBudget}>Set Budget</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {sortedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
