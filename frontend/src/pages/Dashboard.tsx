import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart as PieChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Budget {
  _id: string;
  month: string;
  income: number;
  categories: Array<{
    _id: string;
    name: string;
    limit: number;
  }>;
}

interface Expense {
  _id: string;
  budget: string;
  category: string;
  amount: number;
  date: string;
  note: string;
}

const Dashboard = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showAllExpenses, setShowAllExpenses] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsResponse, expensesResponse] = await Promise.all([
        axios.get('/budget'),
        axios.get('/expenses')
      ]);
      console.log('Budgets from API:', budgetsResponse.data);
      console.log('Expenses from API:', expensesResponse.data);
      setBudgets(budgetsResponse.data);
      setExpenses(expensesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthBudget = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    return budgets.find(budget => budget.month === currentMonth);
  };

  const getCurrentMonthExpenses = () => {
    const currentMonthBudget = getCurrentMonthBudget();
    if (!currentMonthBudget) return [];
    
    return expenses.filter(expense => expense.budget === currentMonthBudget._id);
  };

  // Helper to get category name (just return the name, since that's what is stored)
  const getCategoryName = (categoryName: string) => categoryName;

  const calculateStats = () => {
    const currentBudget = getCurrentMonthBudget();
    const currentExpenses = getCurrentMonthExpenses();
    
    if (!currentBudget) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        remainingBudget: 0,
        categoryData: [],
        monthlyTrend: []
      };
    }

    const totalExpenses = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = currentBudget.income - totalExpenses;

    // Category breakdown (match by category.name)
    const categoryData = currentBudget.categories.map(category => {
      const spent = currentExpenses
        .filter(expense => expense.category === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        name: category.name,
        limit: category.limit,
        spent: spent,
        remaining: Math.max(0, category.limit - spent)
      };
    });

    // Monthly trend (last 6 months)
    const monthlyTrend = budgets.slice(-6).map(budget => {
      const budgetExpenses = expenses.filter(expense => expense.budget === budget._id);
      const totalExpenses = budgetExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        month: budget.month.split(' ')[0],
        income: budget.income,
        expenses: totalExpenses,
        savings: budget.income - totalExpenses
      };
    });

    return {
      totalIncome: currentBudget.income,
      totalExpenses,
      remainingBudget,
      categoryData,
      monthlyTrend
    };
  };

  const stats = calculateStats();
  console.log('Dashboard stats:', stats);

  const COLORS = ['#1A6AFF', '#2FFFCF', '#FF5C7C', '#FFD600', '#6B7A90'];

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-light-gray rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-4 bg-light-gray rounded w-24 mb-4"></div>
                <div className="h-8 bg-light-gray rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!getCurrentMonthBudget()) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <PieChartIcon className="h-16 w-16 text-light-gray mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-gray mb-2">No budget for the current month</h3>
          <p className="text-slate-gray mb-6">Create a budget for this month to start tracking your finances.</p>
          <button
            onClick={() => navigate('/budgets')}
            className="px-6 py-3 bg-button-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-gray">Dashboard</h1>
        <p className="text-slate-gray mt-1">Your financial overview at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-light-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-gray">Total Income</p>
              <p className="text-2xl font-bold text-dark-gray">₦{stats.totalIncome.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-mint-green/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-mint-green" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-light-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-gray">Total Expenses</p>
              <p className="text-2xl font-bold text-dark-gray">₦{stats.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-coral-pink/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-coral-pink" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-light-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-gray">Remaining Budget</p>
              <p className={`text-2xl font-bold ${stats.remainingBudget >= 0 ? 'text-mint-green' : 'text-coral-pink'}`}>₦{stats.remainingBudget.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-finura-blue/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-finura-blue" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-light-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-gray">Categories</p>
              <p className="text-2xl font-bold text-dark-gray">{stats.categoryData.length}</p>
            </div>
            <div className="h-12 w-12 bg-gold-accent/10 rounded-lg flex items-center justify-center">
              <PieChartIcon className="h-6 w-6 text-gold-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-light-gray">
          <h3 className="text-lg font-semibold text-dark-gray mb-4">Category Breakdown</h3>
          {stats.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="spent"
                >
                  {stats.categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <PieChartIcon className="h-16 w-16 text-light-gray mb-4" />
              <p className="text-slate-gray">No budget data available</p>
              <button
                onClick={() => navigate('/budgets')}
                className="mt-4 px-4 py-2 bg-button-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Create Budget
              </button>
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-light-gray">
          <h3 className="text-lg font-semibold text-dark-gray mb-4">Monthly Trend</h3>
          {stats.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income" fill="#1A6AFF" name="Income" />
                <Bar dataKey="expenses" fill="#FF5C7C" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <BarChart className="h-16 w-16 text-light-gray mb-4" />
              <p className="text-slate-gray">No trend data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-light-gray">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-gray">Recent Expenses</h3>
          {getCurrentMonthExpenses().length > 3 && (
            <button
              onClick={() => setShowAllExpenses((v) => !v)}
              className="text-finura-blue hover:text-finura-blue/80 font-medium"
            >
              {showAllExpenses ? 'Show less' : 'View all'}
            </button>
          )}
        </div>
        {getCurrentMonthExpenses().length > 0 ? (
          <div className="space-y-4">
            {(showAllExpenses ? getCurrentMonthExpenses() : getCurrentMonthExpenses().slice(0, 3)).map((expense) => (
              <div key={expense._id} className="flex items-center justify-between py-3 border-b border-light-gray last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-finura-blue/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-finura-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-gray">{getCategoryName(expense.category)}</p>
                    <p className="text-sm text-slate-gray">{expense.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-dark-gray">₦{expense.amount.toLocaleString()}</p>
                  <p className="text-sm text-slate-gray">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-16 w-16 text-light-gray mx-auto mb-4" />
            <p className="text-slate-gray">No recent expenses</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;