import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportData } from '@/types/finance';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface ReportsChartProps {
  reportData: ReportData;
}

const EXPENSE_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 
  'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

export const ReportsChart = ({ reportData }: ReportsChartProps) => {
  const expenseEntries = Object.entries(reportData.expensesByCategory);
  const incomeEntries = Object.entries(reportData.incomesByCategory);
  const maxExpense = Math.max(...expenseEntries.map(([_, amount]) => amount), 1);
  const maxIncome = Math.max(...incomeEntries.map(([_, amount]) => amount), 1);

  return (
    <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--shadow-card)' }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5" />
          </div>
          Financial Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Trend
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Income
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Last 6 Months Overview</h4>
              <div className="space-y-3">
                {reportData.monthlyData.map((month, index) => {
                  const maxAmount = Math.max(month.income, month.expenses, 1);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex gap-4 text-xs">
                          <span className="text-income">Income: ₹{month.income.toFixed(2)}</span>
                          <span className="text-expense">Expenses: ₹{month.expenses.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div 
                          className="bg-income transition-all duration-300"
                          style={{ width: `${(month.income / maxAmount) * 50}%` }}
                          title={`Income: ₹${month.income.toFixed(2)}`}
                        />
                        <div 
                          className="bg-expense transition-all duration-300"
                          style={{ width: `${(month.expenses / maxAmount) * 50}%` }}
                          title={`Expenses: ₹${month.expenses.toFixed(2)}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            {expenseEntries.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Expenses by Category</h4>
                <div className="space-y-3">
                  {expenseEntries.map(([category, amount], index) => {
                    const percentage = ((amount / reportData.totalExpenses) * 100);
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category}</span>
                          <div className="text-right">
                            <span className="font-semibold">₹{amount.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full ${EXPENSE_COLORS[index % EXPENSE_COLORS.length]} transition-all duration-500`}
                            style={{ width: `${(amount / maxExpense) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No expense data to display</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="income" className="mt-6">
            {incomeEntries.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Income by Category</h4>
                <div className="space-y-3">
                  {incomeEntries.map(([category, amount]) => {
                    const percentage = ((amount / reportData.totalIncome) * 100);
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category}</span>
                          <div className="text-right">
                            <span className="font-semibold">₹{amount.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-income transition-all duration-500"
                            style={{ width: `${(amount / maxIncome) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No income data to display</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};