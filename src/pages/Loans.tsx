import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Plus, ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Loans() {
  const { loans, addLoan, toggleLoanSettled, deleteLoan } = useFinanceData();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'given' | 'taken'>('given');
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = () => {
    
    const saved = addLoan({
      type,
      personName,
      amount: Number(amount),
      description,
      date,
      isSettled: false
    });
    if (!saved) return;
    
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setPersonName('');
    setAmount('');
    setDescription('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const givenLoans = loans.filter(l => l.type === 'given' && !l.isSettled);
  const takenLoans = loans.filter(l => l.type === 'taken' && !l.isSettled);
  const settledLoans = loans.filter(l => l.isSettled);

  const totalGiven = givenLoans.reduce((sum, l) => sum + l.amount, 0);
  const totalTaken = takenLoans.reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Loans</h1>
          <p className="text-muted-foreground">Track money you've lent or borrowed</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Loan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Tabs value={type} onValueChange={(v) => setType(v as 'given' | 'taken')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="given">Money Given</TabsTrigger>
                  <TabsTrigger value="taken">Money Taken</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <Label>Person Name</Label>
                <Input
                  placeholder="Enter name"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                />
              </div>

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
                <Label>Description (optional)</Label>
                <Input
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Add Loan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <ArrowUpRight className="h-5 w-5" />
              <span className="text-sm font-medium">Money Given</span>
            </div>
            <p className="text-3xl font-bold mt-2">₹{totalGiven.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <ArrowDownLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Money Taken</span>
            </div>
            <p className="text-3xl font-bold mt-2">₹{totalTaken.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Loans */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Loans</h2>
        {[...givenLoans, ...takenLoans].length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No active loans
            </CardContent>
          </Card>
        ) : (
          [...givenLoans, ...takenLoans].map(loan => (
            <Card key={loan.id}>
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={loan.isSettled}
                    onCheckedChange={() => toggleLoanSettled(loan.id)}
                  />
                  <div className={`p-2 rounded-full ${
                    loan.type === 'given' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {loan.type === 'given' 
                      ? <ArrowUpRight className="h-5 w-5" />
                      : <ArrowDownLeft className="h-5 w-5" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{loan.personName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(loan.date), 'MMM d, yyyy')}
                      {loan.description && ` • ${loan.description}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${
                    loan.type === 'given' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ₹{loan.amount.toLocaleString('en-IN')}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteLoan(loan.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Settled Loans */}
      {settledLoans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Settled Loans</h2>
          {settledLoans.map(loan => (
            <Card key={loan.id} className="opacity-60">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={loan.isSettled}
                    onCheckedChange={() => toggleLoanSettled(loan.id)}
                  />
                  <div>
                    <p className="font-medium line-through">{loan.personName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(loan.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-muted-foreground">
                  ₹{loan.amount.toLocaleString('en-IN')}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
