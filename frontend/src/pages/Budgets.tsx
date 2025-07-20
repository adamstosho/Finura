import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';
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

interface CategoryForm {
  name: string;
  limit: string;
}

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    month: '',
    income: '',
    categories: [{ name: '', limit: '' }] as CategoryForm[]
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/budget');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const budgetData = {
        ...formData,
        income: Number(formData.income),
        categories: formData.categories.map(cat => ({
          name: cat.name,
          limit: Number(cat.limit)
        }))
      };

      if (editingBudget) {
        await axios.put(`/budget/${editingBudget._id}`, budgetData);
      } else {
        await axios.post('/budget', budgetData);
      }

      fetchBudgets();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`/budget/${id}`);
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      month: '',
      income: '',
      categories: [{ name: '', limit: '' }]
    });
    setEditingBudget(null);
  };

  const openModal = (budget: Budget | null = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        month: budget.month,
        income: budget.income.toString(),
        categories: budget.categories.map(cat => ({
          name: cat.name,
          limit: cat.limit.toString()
        }))
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, { name: '', limit: '' }]
    }));
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const updateCategory = (index: number, field: keyof CategoryForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, [field]: value } : cat
      )
    }));
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-light-gray rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-4 bg-light-gray rounded w-24 mb-4"></div>
                <div className="h-8 bg-light-gray rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-light-gray rounded"></div>
                  <div className="h-4 bg-light-gray rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-gray">Budgets</h1>
          <p className="text-slate-gray mt-1">Manage your monthly budgets</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-button-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
          <span>New Budget</span>
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-12">
          <span className="h-16 w-16 text-light-gray mx-auto mb-4 flex items-center justify-center text-6xl font-bold">₦</span>
          <h3 className="text-lg font-semibold text-dark-gray mb-2">No budgets yet</h3>
          <p className="text-slate-gray mb-6">Create your first budget to start tracking your finances</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-button-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <div key={budget._id} className="bg-white rounded-xl shadow-sm p-6 border border-light-gray">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-gray">{budget.month}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    title="Edit Budget"
                    onClick={() => openModal(budget)}
                    className="p-2 text-slate-gray hover:text-finura-blue transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    title="Delete Budget"
                    onClick={() => handleDelete(budget._id)}
                    className="p-2 text-slate-gray hover:text-coral-pink transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-gray">Total Income</span>
                  <span className="font-semibold text-mint-green">₦{budget.income.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-gray">Total Budget</span>
                  <span className="font-semibold text-dark-gray">
                    ₦{budget.categories.reduce((sum, cat) => sum + cat.limit, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-dark-gray">Categories</h4>
                {budget.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-light-gray last:border-b-0">
                    <span className="text-sm text-slate-gray">{category.name}</span>
                    <span className="text-sm font-medium text-dark-gray">₦{category.limit.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-dark-gray mb-6">
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    value={formData.month}
                    onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    placeholder="e.g., January 2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-dark-gray">
                      Categories
                    </label>
                    <button
                      type="button"
                      onClick={addCategory}
                      className="text-finura-blue hover:text-finura-blue/80 text-sm"
                    >
                      Add Category
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.categories.map((category, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                          placeholder="Category name"
                          required
                        />
                        <input
                          type="number"
                          value={category.limit}
                          onChange={(e) => updateCategory(index, 'limit', e.target.value)}
                          className="w-24 px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                          placeholder="Limit"
                          required
                        />
                        {formData.categories.length > 1 && (
                          <button
                            title="Remove Category"
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="p-2 text-coral-pink hover:text-coral-pink/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
                    {editingBudget ? 'Update' : 'Create'}
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

export default Budgets;