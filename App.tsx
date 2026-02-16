
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole, House } from './types';
import { MOCK_USERS, MOCK_HOUSES } from './utils/mockData';

// Pages & Components
import Login from './components/auth/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import HouseManagement from './components/admin/HouseManagement';
import UserManagement from './components/admin/UserManagement';
import LeakManagement from './components/admin/LeakManagement';
import ReadingValidation from './components/admin/ReadingValidation';
import IssuanceManagement from './components/admin/IssuanceManagement';
import FinancialReports from './components/admin/FinancialReports';
import SettingsPage from './components/admin/SettingsPage';

import ClientDashboard from './components/client/ClientDashboard';
import ClientPortal from './components/client/ClientPortal';

import ReaderDashboard from './components/reader/ReaderDashboard';
import TechnicianDashboard from './components/technician/TechnicianDashboard';

import Layout from './components/layout/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeHouse, setActiveHouse] = useState<House | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedHouse = localStorage.getItem('active_house');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHouse) setActiveHouse(JSON.parse(savedHouse));
  }, []);

  const handleLogin = (u: User, house?: House) => {
    setUser(u);
    if (house) setActiveHouse(house);
    localStorage.setItem('auth_user', JSON.stringify(u));
    if (house) localStorage.setItem('active_house', JSON.stringify(house));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveHouse(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('active_house');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {/* Admin Routes */}
          {user.role === UserRole.ADMIN && (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/houses" element={<HouseManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/leaks" element={<LeakManagement />} />
              <Route path="/readings" element={<ReadingValidation />} />
              <Route path="/issuance" element={<IssuanceManagement />} />
              <Route path="/reports" element={<FinancialReports />} />
              <Route path="/settings" element={<SettingsPage />} />
            </>
          )}

          {/* Client Routes */}
          {user.role === UserRole.CLIENTE && (
            <>
              <Route path="/" element={<ClientDashboard house={activeHouse!} />} />
              <Route path="/client/*" element={<ClientPortal house={activeHouse!} />} />
            </>
          )}

          {/* Reader Routes */}
          {user.role === UserRole.LEITOR && (
            <>
              <Route path="/" element={<ReaderDashboard />} />
              <Route path="/houses" element={<HouseManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/readings" element={<ReadingValidation />} />
              <Route path="/leaks" element={<LeakManagement />} />
              <Route path="/issuance" element={<IssuanceManagement />} />
            </>
          )}

          {/* Technician Routes */}
          {user.role === UserRole.TECNICO && (
            <>
              <Route path="/" element={<TechnicianDashboard />} />
              <Route path="/houses" element={<HouseManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/leaks" element={<LeakManagement />} />
              <Route path="/issuance" element={<IssuanceManagement />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
