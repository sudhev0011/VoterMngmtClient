import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserCredentials, clearUserCredentials } from './store/slices/authSlice';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import Login from './components/Login';
import { Vote, Menu, X, Home, Shield, UserCheck, Users, LogOut } from 'lucide-react';

const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, disabled, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-slate-200 hover:bg-slate-50 hover:text-slate-900',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'hover:bg-slate-100 hover:text-slate-900',
    link: 'underline-offset-4 hover:underline text-blue-600'
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

function App() {
  const [role, setRole] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log('isAuthenticated', isAuthenticated)
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}auth/check`, {
          withCredentials: true,
        });
        dispatch(setUserCredentials({ role: res.data.role, userId: res.data.userId, isAuthenticated: res.data.isAuthenticated }));
        setRole(res.data.role);
      } catch (err) {
        dispatch(clearUserCredentials());
        setRole(null);
      }
    };
    checkAuth();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}auth/logout`, {}, { withCredentials: true });
      dispatch(clearUserCredentials());
      setRole(null);
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Login setRole={setRole} />
      </Router>
    );
  }

  const navItems = [
    { icon: Home, label: 'Home', href: '/', show: true },
    { icon: Shield, label: 'Admin Panel', href: '/admin', show: role === 'admin' },
    { icon: UserCheck, label: 'Todo List', href: '/todos', show: role === 'user' }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="bg-white shadow-lg"
          >
            {isNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Vote className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">VoteManager</h1>
                  <p className="text-sm text-slate-500">Electoral System</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.filter(item => item.show).map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  onClick={() => setIsNavOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            
            {/* Logout Button */}
            <div className="p-4 border-t border-slate-200">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isNavOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsNavOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="lg:pl-64">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Voter Management System</h1>
                <p className="text-slate-600">Manage voters and track voting progress efficiently</p>
              </div>

              {/* Content Routes */}
              {role === 'admin' ? (
                <AdminRoutes role={role} setRole={setRole} />
              ) : (
                <UserRoutes role={role} setRole={setRole} isAuthenticated={isAuthenticated} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;