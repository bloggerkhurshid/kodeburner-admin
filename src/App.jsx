import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { SetPassword } from './pages/SetPassword';

import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Notes } from './pages/Notes';
import { Books } from './pages/Books';
import { Semesters } from './pages/Semesters';
import { UsersPage } from './pages/Users';
import { Admins } from './pages/Admins';
import { Profile } from './pages/Profile';

import { ProtectedRoute, RoleProtectedRoute } from './routes/Guards';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/set-password" element={<SetPassword />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/books" element={<Books />} />
                <Route path="/semesters" element={<Semesters />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/profile" element={<Profile />} />

                {/* Superadmin Only Routes */}
                <Route element={<RoleProtectedRoute roles={['superadmin']} />}>
                  <Route path="/admins" element={<Admins />} />
                </Route>
              </Route>
            </Route>

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
