import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { authAPI } from '../services/api';

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      const profileResponse = await authAPI.getProfile();
      localStorage.setItem('user', JSON.stringify(profileResponse.data));
      setUserRole(profileResponse.data.role);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e8ecf3',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        sx={{
          width: '450px',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '25px 40px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#a78bfa',
            mb: 0.5,
            textAlign: 'center',
            fontSize: '28px',
          }}
        >
          Connexion
        </Typography>

        <Typography
          variant="body2"
          sx={{ 
            color: '#a78bfa', 
            mb: 2, 
            fontSize: '12px',
            textAlign: 'center',
          }}
        >
          Plateforme GPS
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: '12px', py: 0.5 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Nom d'utilisateur"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
            InputProps={{
              startAdornment: <PersonIcon sx={{ color: '#a78bfa', mr: 1, fontSize: 20 }} />,
            }}
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#f5f7fa',
                '& input': { padding: '10px 14px' },
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: '#a78bfa' },
                '&.Mui-focused fieldset': { borderColor: '#a78bfa' },
              },
            }}
          />

          <TextField
            fullWidth
            type="password"
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
            InputProps={{
              startAdornment: <LockIcon sx={{ color: '#a78bfa', mr: 1, fontSize: 20 }} />,
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#f5f7fa',
                '& input': { padding: '10px 14px' },
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: '#a78bfa' },
                '&.Mui-focused fieldset': { borderColor: '#a78bfa' },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: '12px',
              padding: '10px',
              background: 'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(196, 113, 237, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f64f59 0%, #c471ed 100%)',
              },
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: '#9ca3af', my: 1.5, fontSize: '12px' }}
        >
          ou se connecter avec
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              flex: 1,
              borderRadius: '12px',
              textTransform: 'none',
              borderColor: '#e5e7eb',
              color: '#6b7280',
              fontSize: '13px',
              padding: '8px 16px',
              '&:hover': {
                borderColor: '#a78bfa',
                backgroundColor: '#faf5ff',
              },
            }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{
              flex: 1,
              borderRadius: '12px',
              textTransform: 'none',
              borderColor: '#e5e7eb',
              color: '#6b7280',
              fontSize: '13px',
              padding: '8px 16px',
              '&:hover': {
                borderColor: '#a78bfa',
                backgroundColor: '#faf5ff',
              },
            }}
          >
            Facebook
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
