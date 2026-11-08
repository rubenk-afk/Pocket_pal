import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinanceData } from '@/hooks/useFinanceData';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/finance';
import { Plus, ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Transactions() {
  const { accounts, transactions, addTransaction, deleteTransaction } = useFinanceData();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));

  const handleSubmit = () => {
    
    const saved = addTransaction({
      accountId,
      type,
      amount: Number(amount),
      category,
      description,
      date,
      time
    });
    if (!saved) return;
    
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setTime(format(new Date(), 'HH:mm'));
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Track your income and expenses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Tabs value={type} onValueChange={(v) => { setType(v as 'income' | 'expense'); setCategory(''); }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="expense">Expense</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(acc => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Input
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Add {type === 'income' ? 'Income' : 'Expense'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No transactions yet. Add your first transaction!
            </CardContent>
          </Card>
        ) : (
          transactions.map(transaction => (
            <Card key={transaction.id}>
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {transaction.type === 'income' 
                      ? <ArrowDownLeft className="h-5 w-5" />
                      : <ArrowUpRight className="h-5 w-5" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM d, yyyy')} • {transaction.time}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
