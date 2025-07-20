import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-finura-blue via-mint-green to-white flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center space-x-2">
          <span className="h-10 w-10 bg-finura-blue text-white rounded-full flex items-center justify-center text-2xl font-bold">₦</span>
          <span className="text-2xl font-bold text-finura-blue">Finura</span>
        </div>
        <nav className="space-x-4">
          <Link to="/login" className="text-finura-blue font-medium hover:underline">Login</Link>
          <Link to="/register" className="bg-finura-blue text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-finura-blue/90 transition">Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-dark-gray mb-4 drop-shadow-lg">Take Control of Your Finances with <span className="text-finura-blue">Finura</span></h1>
        <p className="text-lg sm:text-xl text-slate-gray mb-8 max-w-2xl mx-auto">Finura helps you track your income, set budgets, manage expenses, and visualize your financial trends—all in one beautiful, easy-to-use app.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-button-gradient text-white px-8 py-3 rounded-lg font-semibold shadow hover:opacity-90 transition">Create Free Account</Link>
          <Link to="/login" className="bg-white border border-finura-blue text-finura-blue px-8 py-3 rounded-lg font-semibold shadow hover:bg-finura-blue hover:text-white transition">Login</Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-12 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-finura-blue text-3xl mb-2">📊</span>
            <h3 className="font-bold text-lg mb-1">Visualize Trends</h3>
            <p className="text-slate-gray text-sm">Interactive charts help you see your spending and savings over time.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-mint-green text-3xl mb-2">💸</span>
            <h3 className="font-bold text-lg mb-1">Track Expenses</h3>
            <p className="text-slate-gray text-sm">Easily log and categorize your expenses to stay on top of your budget.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-gold-accent text-3xl mb-2">🎯</span>
            <h3 className="font-bold text-lg mb-1">Set Budgets</h3>
            <p className="text-slate-gray text-sm">Set monthly budgets and get insights to help you reach your financial goals.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-gray text-sm">
        &copy; {new Date().getFullYear()} Finura. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing; 