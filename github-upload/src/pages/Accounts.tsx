import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Wallet, CreditCard, Edit2 } from 'lucide-react';

export default function Accounts() {
  const { accounts, updateAccountBalance } = useFinanceData();
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState('');

  const handleUpdateBalance = (accountId: string) => {
    const balance = newBalance.trim() ? Number(newBalance) : NaN;
    if (!isNaN(balance)) {
      if (!updateAccountBalance(accountId, balance)) return;
      setEditingAccount(null);
      setNewBalance('');
    }
  };

  const bankAccount = accounts.find(a => a.type === 'bank');
  const fampayAccount = accounts.find(a => a.type === 'fampay');
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Accounts</h1>
        <p className="text-muted-foreground">Manage your accounts</p>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <p className="text-4xl font-bold text-primary mt-1">
            ₹{totalBalance.toLocaleString('en-IN')}
          </p>
        </CardContent>
      </Card>

      {/* Account Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bank Account */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              {bankAccount?.name}
            </CardTitle>
            <Dialog open={editingAccount === bankAccount?.id} onOpenChange={(open) => !open && setEditingAccount(null)}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setEditingAccount(bankAccount?.id || null);
                    setNewBalance(bankAccount?.balance.toString() || '');
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Balance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    type="number"
                    placeholder="Enter new balance"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                  />
                  <Button onClick={() => handleUpdateBalance(bankAccount?.id || '')} className="w-full">
                    Update
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{bankAccount?.balance.toLocaleString('en-IN')}</p>
            <p className="text-sm text-muted-foreground mt-1">Primary Account</p>
          </CardContent>
        </Card>

        {/* FamPay Account */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {fampayAccount?.name}
            </CardTitle>
            <Dialog open={editingAccount === fampayAccount?.id} onOpenChange={(open) => !open && setEditingAccount(null)}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setEditingAccount(fampayAccount?.id || null);
                    setNewBalance(fampayAccount?.balance.toString() || '');
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Balance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    type="number"
                    placeholder="Enter new balance"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                  />
                  <Button onClick={() => handleUpdateBalance(fampayAccount?.id || '')} className="w-full">
                    Update
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{fampayAccount?.balance.toLocaleString('en-IN')}</p>
            <p className="text-sm text-muted-foreground mt-1">Sub-account</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
