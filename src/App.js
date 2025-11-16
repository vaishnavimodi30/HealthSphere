import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AppointmentScheduler from './components/appointment/AppointmentScheduler';
import MedicalRecords from './components/medical/MedicalRecords';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Main App Content Component
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading HealthSphere...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={`/${user.role.toLowerCase()}`} replace />}
          />

          {/* Patient Routes */}
          <Route path="/patient/*" element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <Routes>
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/appointments" element={<AppointmentScheduler />} />
                <Route path="/records" element={<MedicalRecords />} />
                <Route path="/" element={<Navigate to="/patient/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/*" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <Routes>
                <Route path="/dashboard" element={<DoctorDashboard />} />
                <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Routes>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="/" element={
            user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace /> : <Navigate to="/login" replace />
          } />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;