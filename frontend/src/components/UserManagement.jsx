import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: '', email: '', first_name: '', last_name: '', role: 'user', password: '', company: ''
  });
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
    
    // Auto-assigner company pour admin/supervisor
    if (user.role === 'admin' || user.role === 'supervisor') {
      setCurrentUser(prev => ({ ...prev, company: user.company }));
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://192.168.43.35:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.results || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur:', error);
      setUsers([]);
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://192.168.43.35:8000/api/companies/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleOpen = (user = null) => {
    const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setEditMode(true);
      setCurrentUser(user);
    } else {
      setEditMode(false);
      const newUser = { username: '', email: '', first_name: '', last_name: '', role: 'user', password: '', company: '' };
      // Auto-assigner company pour admin/supervisor
      if (currentUserData.role === 'admin' || currentUserData.role === 'supervisor') {
        newUser.company = currentUserData.company;
      }
      setCurrentUser(newUser);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser({ username: '', email: '', first_name: '', last_name: '', role: 'user', password: '', company: '' });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = { ...currentUser };
      
      // Ne pas envoyer company si vide
      if (!userData.company) {
        delete userData.company;
      }
      
      if (editMode) {
        // Ne pas envoyer password si vide en mode édition
        if (!userData.password) {
          delete userData.password;
        }
        await axios.put(`http://192.168.43.35:8000/api/users/${currentUser.id}/`, userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Password requis en création
        if (!userData.password) {
          alert('Le mot de passe est requis');
          return;
        }
        await axios.post('http://192.168.43.35:8000/api/users/', userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data ? JSON.stringify(error.response.data) : 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://192.168.43.35:8000/api/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  return (
    <Box sx={{ background: '#ecf0f5', minHeight: '100vh', p: 4, pl: 4, pr: 0, m: 0, width: '100%' }}>
      <div style={{ width: '100%', margin: '0', padding: '0 20px 0 0' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#2d3748', fontWeight: '700' }}>Gestion des Utilisateurs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          Nouvel Utilisateur
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Rôle</TableCell>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Entreprise</TableCell>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ color: '#2d3748', fontWeight: '600' }}>{user.username}</TableCell>
                <TableCell sx={{ color: '#666' }}>{user.first_name} {user.last_name}</TableCell>
                <TableCell sx={{ color: '#666' }}>{user.email}</TableCell>
                <TableCell><span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>{user.role}</span></TableCell>
                <TableCell sx={{ color: '#666' }}>{user.company_name || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(user)} sx={{ color: '#667eea' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} sx={{ color: '#f5576c' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Modifier' : 'Ajouter'} Utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="normal" label="Username"
            value={currentUser.username}
            onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
          />
          <TextField
            fullWidth margin="normal" label="Prénom"
            value={currentUser.first_name}
            onChange={(e) => setCurrentUser({...currentUser, first_name: e.target.value})}
          />
          <TextField
            fullWidth margin="normal" label="Nom"
            value={currentUser.last_name}
            onChange={(e) => setCurrentUser({...currentUser, last_name: e.target.value})}
          />
          <TextField
            fullWidth margin="normal" label="Email"
            value={currentUser.email}
            onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rôle</InputLabel>
            <Select
              value={currentUser.role}
              onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
            >
              {userRole === 'super_admin' && <MenuItem value="admin">Admin Entreprise</MenuItem>}
              {(userRole === 'admin' || userRole === 'super_admin') && <MenuItem value="supervisor">Superviseur</MenuItem>}
              <MenuItem value="user">Utilisateur</MenuItem>
            </Select>
          </FormControl>
          {userRole === 'super_admin' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Entreprise</InputLabel>
              <Select
                value={currentUser.company}
                onChange={(e) => setCurrentUser({...currentUser, company: e.target.value})}
              >
                <MenuItem value="">Aucune</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {!editMode && (
            <TextField
              fullWidth margin="normal" label="Mot de passe" type="password"
              value={currentUser.password}
              onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
      </div>
    </Box>
  );
};

export default UserManagement;
