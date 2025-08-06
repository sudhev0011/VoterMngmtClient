import React, { useState } from "react";
import axios from "axios";
import { Plus } from 'lucide-react';
import {Button, Card, CardHeader, CardTitle, CardContent, Input, Alert} from './customUI/Customs'

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