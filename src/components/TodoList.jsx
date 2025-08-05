import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { UserCheck, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';

const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, disabled, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-slate-200 hover:bg-slate-50 hover:text-slate-900',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'hover:bg-slate-100 hover:text-slate-900'
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

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-900 text-white',
    secondary: 'bg-slate-100 text-slate-900',
    destructive: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white'
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Alert = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800'
  };
  
  return (
    <div className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        {children}
      </div>
    </div>
  );
};

const TodoList = ({ role }) => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}todos`, { withCredentials: true });
      setTodos(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch todo list');
    }
  };

  const handleToggleVoted = async (id, currentStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE}todos/${id}`, { hasVoted: !currentStatus }, {
        withCredentials: true
      });
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update voting status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}todos/${id}`, {
        withCredentials: true
      });
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert variant="destructive">
        Please log in to view your todo list.
      </Alert>
    );
  }

  const votedCount = todos.filter(todo => todo.hasVoted).length;
  const totalCount = todos.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>My Voter Todo List</span>
          </CardTitle>
          
          {totalCount > 0 && (
            <div className="flex space-x-2">
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {votedCount} Voted
              </Badge>
              <Badge variant="secondary">
                {totalCount - votedCount} Pending
              </Badge>
            </div>
          )}
        </div>
        
        {totalCount > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((votedCount / totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(votedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        
        {todos.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium mb-2">No voters in your todo list</p>
            <p className="text-sm">Add voters from the voter list to track their voting status.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-medium text-slate-700">Serial No</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-700">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-700">Guardian's Name</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-700">House No.</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-700">House Name</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-700">Gender / Age</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-700">ID Card No.</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-700">Voted</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr key={todo._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-2 font-mono text-sm">{todo.voterId.serialNo}</td>
                      <td className="py-3 px-2 font-medium">{todo.voterId.name}</td>
                      <td className="py-3 px-2 text-slate-600">{todo.voterId.guardianName}</td>
                      <td className="py-3 px-2 text-slate-600">{todo.voterId.houseNo}</td>
                      <td className="py-3 px-2 text-slate-600">{todo.voterId.houseName}</td>
                      <td className="py-3 px-2 text-slate-600">{todo.voterId.genderAge}</td>
                      <td className="py-3 px-2 font-mono text-sm text-slate-600">{todo.voterId.idCardNo}</td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => handleToggleVoted(todo._id, todo.hasVoted)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            todo.hasVoted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-slate-300 hover:border-green-400'
                          }`}
                        >
                          {todo.hasVoted && <CheckCircle2 className="h-3 w-3" />}
                        </button>
                      </td>
                      <td className="py-3 px-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(todo._id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {todos.map((todo) => (
                <div 
                  key={todo._id} 
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    todo.hasVoted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <button
                          onClick={() => handleToggleVoted(todo._id, todo.hasVoted)}
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            todo.hasVoted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-slate-300 hover:border-green-400'
                          }`}
                        >
                          {todo.hasVoted && <CheckCircle2 className="h-3 w-3" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium ${todo.hasVoted ? 'text-green-800' : 'text-slate-900'}`}>
                            {todo.voterId.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-600">
                            <span className="font-mono">#{todo.voterId.serialNo}</span>
                            <span>•</span>
                            <span>{todo.voterId.genderAge}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-slate-600 space-y-1">
                        <div><span className="font-medium">Guardian:</span> {todo.voterId.guardianName}</div>
                        <div><span className="font-medium">Address:</span> {todo.voterId.houseNo}, {todo.voterId.houseName}</div>
                        <div><span className="font-medium">ID:</span> {todo.voterId.idCardNo}</div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(todo._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;