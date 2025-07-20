import { useState, useEffect } from 'react';
import { Plus, Trash2, Filter, CreditCard, Calendar } from 'lucide-react';
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

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formData, setFormData] = useState({
    budgetId: '',
    category: '',
    amount: '',
    date: '',
    note: ''
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (selectedBudget) {
      fetchExpenses(selectedBudget);
    }
  }, [selectedBudget]);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/budget');
      setBudgets(response.data);
      if (response.data.length > 0) {
        setSelectedBudget(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async (budgetId: string) => {
    try {
      const response = await axios.get(`/api/expenses?budgetId=${budgetId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString()
      };

      await axios.post('/api/expenses', expenseData);
      fetchExpenses(selectedBudget);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}`);
        fetchExpenses(selectedBudget);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      budgetId: selectedBudget,
      category: '',
      amount: '',
      date: '',
      note: ''
    });
  };

  const openModal = () => {
    setFormData({
      budgetId: selectedBudget,
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setShowModal(true);
  };

  const getCurrentBudget = () => {
    return budgets.find(budget => budget._id === selectedBudget);
  };

  const getAvailableCategories = () => {
    const currentBudget = getCurrentBudget();
    return currentBudget ? currentBudget.categories.map(cat => cat.name) : [];
  };

  const filteredExpenses = expenses.filter(expense => 
    !categoryFilter || expense.category === categoryFilter
  );

  const calculateCategorySpending = () => {
    const currentBudget = getCurrentBudget();
    if (!currentBudget) return [];

    return currentBudget.categories.map(category => {
      const spent = expenses
        .filter(expense => expense.category === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        ...category,
        spent,
        remaining: Math.max(0, category.limit - spent),
        percentage: (spent / category.limit) * 100
      };
    });
  };

  const categorySpending = calculateCategorySpending();

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-light-gray rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-4 bg-light-gray rounded w-32 mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-light-gray rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-4 bg-light-gray rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-light-gray rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-gray">Expenses</h1>
          <p className="text-slate-gray mt-1">Track your spending across categories</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 px-4 py-2 bg-button-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
          disabled={!selectedBudget}
        >
          <Plus className="h-5 w-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-light-gray mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-gray mb-2">No budgets available</h3>
          <p className="text-slate-gray mb-6">Create a budget first to start tracking expenses</p>
          <button
            onClick={() => window.location.href = '/budgets'}
            className="px-6 py-3 bg-button-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expenses List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-light-gray">
              <div className="p-6 border-b border-light-gray">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0">
                      <label className="block text-sm font-medium text-dark-gray mb-1">
                        Budget
                      </label>
                      <select
                        title="Budget"
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="block w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                      >
                        {budgets.map(budget => (
                          <option key={budget._id} value={budget._id}>
                            {budget.month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-slate-gray" />
                    <select
                      title="Category Filter"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    >
                      <option value="">All Categories</option>
                      {getAvailableCategories().map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-16 w-16 text-light-gray mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-dark-gray mb-2">No expenses yet</h3>
                    <p className="text-slate-gray">Start tracking your spending by adding an expense</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredExpenses.map((expense) => (
                      <div key={expense._id} className="flex items-center justify-between p-4 border border-light-gray rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-finura-blue/10 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-finura-blue" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-dark-gray">{expense.category}</h4>
                            <p className="text-sm text-slate-gray">{expense.note}</p>
                            <p className="text-xs text-slate-gray flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-bold text-dark-gray">₦{expense.amount.toLocaleString()}</p>
                          </div>
                          <button
                            title="Delete Expense"
                            onClick={() => handleDelete(expense._id)}
                            className="p-2 text-slate-gray hover:text-coral-pink transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-light-gray">
            <div className="p-6 border-b border-light-gray">
              <h3 className="text-lg font-semibold text-dark-gray">Category Overview</h3>
              <p className="text-sm text-slate-gray mt-1">
                {getCurrentBudget()?.month || 'Select a budget'}
              </p>
            </div>
            
            <div className="p-6">
              {categorySpending.length === 0 ? (
                <div className="text-center py-8">
                  <span className="h-12 w-12 text-light-gray mx-auto mb-4 flex items-center justify-center text-4xl font-bold">₦</span>
                  <p className="text-slate-gray">No categories available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorySpending.map((category) => (
                    <div key={category._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-dark-gray">{category.name}</span>
                        <span className="text-sm text-slate-gray">
                          ₦{category.spent.toLocaleString()} / ₦{category.limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-light-gray rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            category.percentage > 100
                              ? 'bg-coral-pink'
                              : category.percentage > 75
                              ? 'bg-gold-accent'
                              : 'bg-mint-green'
                          } w-[${Math.min(category.percentage, 100)}%]`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-gray">
                          {category.percentage.toFixed(1)}% used
                        </span>
                        <span className={`font-medium ${
                          category.remaining > 0 ? 'text-mint-green' : 'text-coral-pink'
                        }`}>
                          ₦{category.remaining.toLocaleString()} remaining
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-dark-gray mb-6">Add New Expense</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Category
                  </label>
                  <select
                    title="Expense Category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    required
                  >
                    <option value="">Select a category</option>
                    {getAvailableCategories().map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    required
                    title="Expense date"
                    placeholder="Select date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Note
                  </label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    placeholder="Optional description"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-light-gray text-slate-gray rounded-lg hover:bg-light-gray/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-button-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;