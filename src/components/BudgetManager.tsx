import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Budget, Transaction, EXPENSE_CATEGORIES } from '@/types/finance';
import { Target, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'currentUsage'>) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetManager = ({ budgets, transactions, onAddBudget, onDeleteBudget }: BudgetManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !monthlyLimit || !month) return;

    const [year, monthNum] = month.split('-');
    onAddBudget({
      category,
      monthlyLimit: parseFloat(monthlyLimit),
      month: monthNum,
      year: parseInt(year),
    });

    // Reset form
    setCategory('');
    setMonthlyLimit('');
    setShowForm(false);
  };

  // Calculate current usage for each budget
  const budgetsWithUsage = budgets.map(budget => {
    const currentUsage = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          t.category === budget.category &&
          tDate.getMonth() + 1 === parseInt(budget.month) &&
          tDate.getFullYear() === budget.year
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return { ...budget, currentUsage };
  });

  const getBudgetStatus = (usage: number, limit: number) => {
    const percentage = (usage / limit) * 100;
    if (percentage >= 100) return { status: 'over', color: 'text-destructive', icon: AlertTriangle };
    if (percentage >= 80) return { status: 'warning', color: 'text-budget', icon: AlertTriangle };
    return { status: 'good', color: 'text-income', icon: CheckCircle };
  };

  return (
    <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--shadow-card)' }}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </div>
            Budget Manager
          </CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "outline" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Budget'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget-category">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget-limit">Monthly Limit ($)</Label>
                    <Input
                      id="budget-limit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={monthlyLimit}
                      onChange={(e) => setMonthlyLimit(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget-month">Month</Label>
                    <Input
                      id="budget-month"
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Add Budget
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {budgetsWithUsage.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No budgets set</p>
            <p className="text-sm">Create your first budget to track spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgetsWithUsage.map((budget) => {
              const percentage = Math.min((budget.currentUsage / budget.monthlyLimit) * 100, 100);
              const { status, color, icon: StatusIcon } = getBudgetStatus(budget.currentUsage, budget.monthlyLimit);
              
              return (
                <Card key={budget.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{budget.category}</h4>
                        <Badge variant="outline" className="text-xs">
                          {new Date(budget.year, parseInt(budget.month) - 1).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${color}`} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteBudget(budget.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${budget.currentUsage.toFixed(2)}</span>
                        <span>Limit: ${budget.monthlyLimit.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${
                          status === 'over' ? '[&>div]:bg-destructive' :
                          status === 'warning' ? '[&>div]:bg-budget' :
                          '[&>div]:bg-income'
                        }`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{percentage.toFixed(1)}% used</span>
                        <span>${(budget.monthlyLimit - budget.currentUsage).toFixed(2)} remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};