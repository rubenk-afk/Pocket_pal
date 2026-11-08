import { useEffect, useState } from 'react';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BudgetStatus } from '@/components/dashboard/BudgetStatus';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { UpcomingReminders } from '@/components/dashboard/UpcomingReminders';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { 
    accounts, 
    transactions, 
    reminders,
    getCurrentMonthExpenses,
    getCurrentBudget,
    markBudgetAlertShown
  } = useFinanceData();

  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
  
  const currentExpenses = getCurrentMonthExpenses();
  const currentBudget = getCurrentBudget();

  useEffect(() => {
    if (currentBudget && !currentBudget.alertShown) {
      const percentage = (currentExpenses / currentBudget.limit) * 100;
      if (percentage >= 80) {
        setShowBudgetAlert(true);
      }
    }
  }, [currentExpenses, currentBudget]);

  const handleDismissAlert = () => {
    setShowBudgetAlert(false);
    if (currentBudget) {
      markBudgetAlertShown(currentBudget.month);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your finances</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <BalanceCard accounts={accounts} />
        <BudgetStatus budget={currentBudget} currentExpenses={currentExpenses} />
        <RecentTransactions transactions={transactions} />
        <UpcomingReminders reminders={reminders} />
      </div>

      {/* Budget Alert Dialog */}
      <Dialog open={showBudgetAlert} onOpenChange={(open) => { if (!open) handleDismissAlert(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Budget Alert!
            </DialogTitle>
            <DialogDescription>
              You've spent 80% or more of your monthly budget. Current spending: 
              ₹{currentExpenses.toLocaleString('en-IN')} of ₹{currentBudget?.limit.toLocaleString('en-IN')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleDismissAlert}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
