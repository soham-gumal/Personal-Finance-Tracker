import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const BalanceCard = ({ totalIncome, totalExpenses, balance }: BalanceCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Income */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-income to-income/90" style={{ boxShadow: 'var(--shadow-card)' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-income-foreground/80 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-income-foreground">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-income-foreground/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-income-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-expense to-expense/90" style={{ boxShadow: 'var(--shadow-card)' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-expense-foreground/80 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-expense-foreground">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-expense-foreground/20 rounded-full">
              <TrendingDown className="h-6 w-6 text-expense-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Balance */}
      <Card className={`shadow-lg border-0 ${
        balance >= 0 
          ? 'bg-gradient-to-br from-primary to-primary/90' 
          : 'bg-gradient-to-br from-destructive to-destructive/90'
      }`} style={{ boxShadow: 'var(--shadow-card)' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Net Balance</p>
              <p className={`text-2xl font-bold ${
                balance >= 0 ? 'text-primary-foreground' : 'text-destructive-foreground'
              }`}>
                ${balance.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              balance >= 0 
                ? 'bg-primary-foreground/20' 
                : 'bg-destructive-foreground/20'
            }`}>
              <Wallet className={`h-6 w-6 ${
                balance >= 0 ? 'text-primary-foreground' : 'text-destructive-foreground'
              }`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};