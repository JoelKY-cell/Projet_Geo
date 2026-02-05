import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import SystemAdminDashboard from './components/SystemAdminDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import UserDashboard from './components/UserDashboard';
import VehicleMap from './components/VehicleMap';
import VehicleList from './components/VehicleList';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import CompanyManagement from './components/CompanyManagement';
import Sidebar from './components/Navbar';
import { authAPI } from './services/api';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile()
        .then(response => {
          setIsAuthenticated(true);
          setUserRole(response.data.role);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  const getDashboard = () => {
    if (userRole === 'super_admin') return <SystemAdminDashboard />;
    if (userRole === 'admin') return <AdminDashboard />;
    if (userRole === 'supervisor') return <SupervisorDashboard />;
    return <UserDashboard />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isAuthenticated ? (
          <Box sx={{ display: 'flex' }}>
            <Sidebar setIsAuthenticated={setIsAuthenticated} userRole={userRole} />
            <Box component="main" sx={{ flexGrow: 1, p: 0, m: 0 }}>
              <Routes>
                <Route path="/" element={getDashboard()} />
                <Route path="/map" element={<VehicleMap />} />
                <Route path="/vehicles" element={<VehicleList userRole={userRole} />} />
                <Route path="/reports" element={<Reports userRole={userRole} />} />
                {(userRole === 'admin' || userRole === 'supervisor') && <Route path="/users" element={<UserManagement />} />}
                {userRole === 'super_admin' && <Route path="/companies" element={<CompanyManagement />} />}
                {userRole === 'super_admin' && <Route path="/users" element={<UserManagement />} />}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
          </Box>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;