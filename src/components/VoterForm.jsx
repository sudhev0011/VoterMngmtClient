import React, { useState } from "react";
import axios from "axios";
import { Plus, AlertCircle } from 'lucide-react';

// Shadcn-like components
const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, disabled, type, ...props }) => {
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
    lg: 'h-11 px-8 rounded-md'
  };
  
  return (
    <button
      type={type}
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

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

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

const VoterForm = () => {
  const [voter, setVoter] = useState({
    serialNo: "",
    name: "",
    guardianName: "",
    houseNo: "",
    houseName: "",
    genderAge: "",
    idCardNo: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setVoter({ ...voter, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}voters`, voter, {
        withCredentials: true,
      });
      setVoter({
        serialNo: "",
        name: "",
        guardianName: "",
        houseNo: "",
        houseName: "",
        genderAge: "",
        idCardNo: "",
      });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add voter");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add New Voter</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Serial No.</label>
              <Input
                type="number"
                name="serialNo"
                value={voter.serialNo}
                onChange={handleChange}
                placeholder="Enter serial number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input
                type="text"
                name="name"
                value={voter.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Guardian's Name</label>
              <Input
                type="text"
                name="guardianName"
                value={voter.guardianName}
                onChange={handleChange}
                placeholder="Enter guardian's name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">House No.</label>
              <Input
                type="text"
                name="houseNo"
                value={voter.houseNo}
                onChange={handleChange}
                placeholder="Enter house number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">House Name</label>
              <Input
                type="text"
                name="houseName"
                value={voter.houseName}
                onChange={handleChange}
                placeholder="Enter house name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Gender / Age</label>
              <Input
                type="text"
                name="genderAge"
                value={voter.genderAge}
                onChange={handleChange}
                placeholder="e.g., M / 45"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">ID Card No.</label>
              <Input
                type="text"
                name="idCardNo"
                value={voter.idCardNo}
                onChange={handleChange}
                placeholder="Enter ID card number"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Voter
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VoterForm;