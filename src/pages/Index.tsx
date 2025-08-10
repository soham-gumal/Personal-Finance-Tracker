import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { BalanceCard } from '@/components/BalanceCard';
import { ReportsChart } from '@/components/ReportsChart';
import { BudgetManager } from '@/components/BudgetManager';
import { useFinanceData } from '@/hooks/useFinanceData';
import { toast } from '@/hooks/use-toast';
import { Wallet, TrendingUp, Target, BarChart3, Plus } from 'lucide-react';

const Index = () => {
  const {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    addBudget,
    deleteBudget,
    generateReportData,
  } = useFinanceData();

  const reportData = generateReportData();

  const handleAddTransaction = (transactionData: any) => {
    addTransaction(transactionData);
    toast({
      title: "Transaction Added",
      description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of $${transactionData.amount} has been recorded.`,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction Deleted",
      description: "The transaction has been removed from your records.",
    });
  };

  const handleAddBudget = (budgetData: any) => {
    addBudget(budgetData);
    toast({
      title: "Budget Created",
      description: `Budget for ${budgetData.category} has been set to $${budgetData.monthlyLimit}/month.`,
    });
  };

  const handleDeleteBudget = (id: string) => {
    deleteBudget(id);
    toast({
      title: "Budget Deleted",
      description: "The budget has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <Wallet className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Personal Finance Tracker
              </h1>
              <p className="text-muted-foreground">Take control of your financial future</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Balance Overview */}
          <section>
            <BalanceCard
              totalIncome={reportData.totalIncome}
              totalExpenses={reportData.totalExpenses}
              balance={reportData.balance}
            />
          </section>

          {/* Main Content Tabs */}
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="budgets" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Budgets
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TransactionForm onAddTransaction={handleAddTransaction} />
                <TransactionList
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              </div>
            </TabsContent>

            <TabsContent value="budgets" className="mt-6">
              <BudgetManager
                budgets={budgets}
                transactions={transactions}
                onAddBudget={handleAddBudget}
                onDeleteBudget={handleDeleteBudget}
              />
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <ReportsChart reportData={reportData} />
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <TransactionList
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </div>
                <div className="space-y-6">
                  <ReportsChart reportData={reportData} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Stats */}
          {transactions.length > 0 && (
            <section>
              <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--shadow-card)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                      <p className="text-2xl font-bold">{transactions.length}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">This Month Income</p>
                      <p className="text-2xl font-bold text-income">
                        ${reportData.monthlyData[reportData.monthlyData.length - 1]?.income.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">This Month Expenses</p>
                      <p className="text-2xl font-bold text-expense">
                        ${reportData.monthlyData[reportData.monthlyData.length - 1]?.expenses.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Active Budgets</p>
                      <p className="text-2xl font-bold">{budgets.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;