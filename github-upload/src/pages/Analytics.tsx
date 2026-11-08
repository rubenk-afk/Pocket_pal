import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceData } from '@/hooks/useFinanceData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', '#8884d8', '#82ca9d', '#ffc658'];

export default function Analytics() {
  const { transactions } = useFinanceData();

  // Category breakdown for current month
  const currentMonth = format(new Date(), 'yyyy-MM');
  const categoryData = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  // Monthly trend (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const monthKey = format(date, 'yyyy-MM');
    const monthLabel = format(date, 'MMM');
    
    const income = transactions
      .filter(t => t.type === 'income' && t.date.startsWith(monthKey))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(monthKey))
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { month: monthLabel, income, expenses };
  });

  // Summary stats
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Understand your spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Income (This Month)</p>
            <p className="text-2xl font-bold text-green-500">₹{totalIncome.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Expenses (This Month)</p>
            <p className="text-2xl font-bold text-red-500">₹{totalExpenses.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Net Savings</p>
            <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{(totalIncome - totalExpenses).toLocaleString('en-IN')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No expense data for this month
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(142, 76%, 36%)" name="Income" />
                  <Bar dataKey="expenses" fill="hsl(0, 84%, 60%)" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category List */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {((cat.value / totalExpenses) * 100).toFixed(1)}%
                    </span>
                    <span className="font-medium">₹{cat.value.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
