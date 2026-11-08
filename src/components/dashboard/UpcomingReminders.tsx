import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Reminder } from '@/types/finance';
import { Bell } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';

interface UpcomingRemindersProps {
  reminders: Reminder[];
}

export function UpcomingReminders({ reminders }: UpcomingRemindersProps) {
  const activeReminders = reminders
    .filter(r => r.isActive)
    .map(r => ({
      ...r,
      daysUntil: differenceInDays(parseISO(r.dueDate), new Date())
    }))
    .filter(r => r.daysUntil >= 0 && r.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        {activeReminders.length === 0 ? (
          <p className="text-muted-foreground text-sm">No upcoming reminders</p>
        ) : (
          <div className="space-y-3">
            {activeReminders.map(reminder => (
              <div key={reminder.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    reminder.daysUntil <= 3 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{reminder.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(reminder.dueDate), 'MMM d')} • ₹{reminder.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  reminder.daysUntil <= 3 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {reminder.daysUntil === 0 ? 'Today' : `${reminder.daysUntil}d`}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
