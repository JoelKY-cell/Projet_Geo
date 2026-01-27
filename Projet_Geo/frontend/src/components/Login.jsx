import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert 
} from '@mui/material';
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
      setUserRole(profileResponse.data.role);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Plateforme GPS
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Connexion
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              margin="normal"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              margin="normal"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" color="textSecondary" display="block">
              Comptes de test:
            </Typography>
            <Typography variant="caption" display="block">Admin: admin / admin123</Typography>
            <Typography variant="caption" display="block">Superviseur: supervisor / super123</Typography>
            <Typography variant="caption" display="block">Utilisateur: user / user123</Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;