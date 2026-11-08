import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Plus, Bell, Trash2 } from 'lucide-react';
import { format, parseISO, differenceInCalendarDays, addDays } from 'date-fns';

export default function Reminders() {
  const { reminders, addReminder, deleteReminder, toggleReminderActive } = useFinanceData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
  const [recurrence, setRecurrence] = useState<'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [customDays, setCustomDays] = useState('');

  const handleSubmit = () => {
    
    const saved = addReminder({
      name,
      amount: Number(amount),
      dueDate,
      recurrence,
      customDays: recurrence === 'custom' ? Number(customDays) : undefined,
      isActive: true
    });
    if (!saved) return;
    
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDueDate(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
    setRecurrence('monthly');
    setCustomDays('');
  };

  const getStatusBadge = (dueDate: string) => {
    const days = differenceInCalendarDays(parseISO(dueDate), new Date());
    if (days < 0) {
      return { text: 'Overdue', className: 'bg-destructive/10 text-destructive' };
    }
    if (days <= 3) {
      return { text: `${days}d left`, className: 'bg-destructive/10 text-destructive' };
    }
    if (days <= 7) {
      return { text: `${days}d left`, className: 'bg-yellow-500/10 text-yellow-600' };
    }
    return { text: `${days}d left`, className: 'bg-muted text-muted-foreground' };
  };

  const activeReminders = reminders.filter(r => r.isActive);
  const inactiveReminders = reminders.filter(r => !r.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">Mobile recharge & bill reminders</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Airtel Recharge"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Recurrence</Label>
                <Select value={recurrence} onValueChange={(v) => setRecurrence(v as typeof recurrence)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {recurrence === 'custom' && (
                <div className="space-y-2">
                  <Label>Repeat every (days)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 28"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                  />
                </div>
              )}

              <Button onClick={handleSubmit} className="w-full">
                Add Reminder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <p className="text-sm text-primary">
            💡 Upcoming bills appear here and on your dashboard. Background notifications and automatic recurrence are not enabled.
          </p>
        </CardContent>
      </Card>

      {/* Active Reminders */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Reminders</h2>
        {activeReminders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No active reminders
            </CardContent>
          </Card>
        ) : (
          activeReminders.map(reminder => {
            const status = getStatusBadge(reminder.dueDate);
            return (
              <Card key={reminder.id}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{reminder.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(reminder.dueDate), 'MMM d, yyyy')} • {reminder.recurrence}
                        {reminder.recurrence === 'custom' && ` (${reminder.customDays} days)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.className}`}>
                      {status.text}
                    </span>
                    <span className="font-bold">₹{reminder.amount.toLocaleString('en-IN')}</span>
                    <Switch
                      checked={reminder.isActive}
                      onCheckedChange={() => toggleReminderActive(reminder.id)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Inactive Reminders */}
      {inactiveReminders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Inactive Reminders</h2>
          {inactiveReminders.map(reminder => (
            <Card key={reminder.id} className="opacity-60">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{reminder.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{reminder.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={reminder.isActive}
                    onCheckedChange={() => toggleReminderActive(reminder.id)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
