import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  PieChart, 
  CreditCard, 
  User, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-deep-navy">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            <button
              type="button"
              title="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-mint-green transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-mint-green bg-finura-blue bg-opacity-20'
                      : 'text-white hover:text-mint-green hover:bg-finura-blue hover:bg-opacity-10'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center w-full px-6 py-3 text-sm font-medium text-white hover:text-coral-pink hover:bg-coral-pink hover:bg-opacity-10 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-deep-navy">
          <div className="flex items-center h-16 px-4">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
          </div>
          <nav className="mt-8 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-mint-green bg-finura-blue bg-opacity-20'
                      : 'text-white hover:text-mint-green hover:bg-finura-blue hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-3 text-sm font-medium text-white hover:text-coral-pink hover:bg-coral-pink hover:bg-opacity-10 transition-colors rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-light-gray">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                type="button"
                title="Open sidebar"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-gray hover:text-deep-navy transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-gray">
                  Welcome back, <span className="font-semibold text-deep-navy">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;