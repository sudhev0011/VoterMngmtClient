import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import VoterList from '../components/VotersList';
import VoterForm from '../components/VoterForm';
import Login from '../components/Login';

const AdminRoutes = ({ role, setRole }) => {
  return (
    <Routes>
      <Route path="/" element={<VoterList role={role} />} />
      <Route
        path="/admin"
        element={
          role === 'admin' ? (
            <>
              <VoterForm />
              <VoterList role={role} />
            </>
          ) : (
            <p className="text-red-500">Access denied. Admin only.</p>
          )
        }
      />
      <Route path="/login" element={<Login setRole={setRole} />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;