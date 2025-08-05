import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import VoterList from '../components/VotersList';
import TodoList from '../components/TodoList';
import Login from '../components/Login';

const UserRoutes = ({ role, setRole, isAuthenticated }) => {
  return (
    <Routes>
      <Route path="/" element={<VoterList role={role} isAuthenticated={isAuthenticated}/>} />
      <Route path="/todos" element={<TodoList role={role} />} />
      <Route path="/login" element={<Login setRole={setRole} />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default UserRoutes;