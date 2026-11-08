import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {transaction.type === 'income' 
                      ? <ArrowDownLeft className="h-4 w-4" />
                      : <ArrowUpRight className="h-4 w-4" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transaction.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM d')}
                    </p>
                  </div>
                </div>
                <span className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
