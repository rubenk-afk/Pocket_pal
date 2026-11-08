import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Account } from '@/types/finance';
import { Wallet, CreditCard } from 'lucide-react';

interface BalanceCardProps {
  accounts: Account[];
}

export function BalanceCard({ accounts }: BalanceCardProps) {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const bankAccount = accounts.find(a => a.type === 'bank');
  const fampayAccount = accounts.find(a => a.type === 'fampay');

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          ₹{totalBalance.toLocaleString('en-IN')}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4" />
              {bankAccount?.name}
            </span>
            <span className="font-medium">₹{bankAccount?.balance.toLocaleString('en-IN') || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              {fampayAccount?.name}
            </span>
            <span className="font-medium">₹{fampayAccount?.balance.toLocaleString('en-IN') || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
