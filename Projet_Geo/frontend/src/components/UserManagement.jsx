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
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: '', email: '', first_name: '', last_name: '', role: 'user', password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.results || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur:', error);
      setUsers([]);
    }
  };

  const handleOpen = (user = null) => {
    if (user) {
      setEditMode(true);
      setCurrentUser(user);
    } else {
      setEditMode(false);
      setCurrentUser({ username: '', email: '', first_name: '', last_name: '', role: 'user', password: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser({ username: '', email: '', first_name: '', last_name: '', role: 'user', password: '' });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(`http://localhost:8000/api/users/${currentUser.id}/`, currentUser, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/users/', currentUser, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestion des Utilisateurs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Nouvel Utilisateur
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.first_name} {user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error">
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
              <MenuItem value="admin">Administrateur</MenuItem>
              <MenuItem value="supervisor">Superviseur</MenuItem>
              <MenuItem value="user">Utilisateur</MenuItem>
            </Select>
          </FormControl>
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
          <Button onClick={handleSave} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
