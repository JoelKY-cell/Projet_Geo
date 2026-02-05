import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.43.35:8000/api';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({ name: '' });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/companies/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erreur:', error);
      setCompanies([]);
    }
  };

  const handleOpen = (company = null) => {
    if (company) {
      setCurrentCompany(company);
      setIsEdit(true);
    } else {
      setCurrentCompany({ name: '' });
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCompany({ name: '' });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/companies/${currentCompany.id}/`, currentCompany, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/companies/`, currentCompany, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchCompanies();
      handleClose();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette entreprise?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/companies/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCompanies();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  return (
    <Box sx={{ background: '#ecf0f5', minHeight: '100vh', p: 4, pl: 4, pr: 0, m: 0, width: '100%' }}>
      <div style={{ width: '100%', margin: '0', padding: '0 20px 0 0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2d3748', fontWeight: '700' }}>Gestion des Entreprises</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          Nouvelle Entreprise
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: '600', color: '#666' }}>Date création</TableCell>
              <TableCell align="right" sx={{ fontWeight: '600', color: '#666' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} hover>
                <TableCell sx={{ color: '#2d3748' }}>{company.name}</TableCell>
                <TableCell>{company.is_active ? <span style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '700' }}>ACTIVE</span> : <span style={{ background: '#999', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '700' }}>INACTIVE</span>}</TableCell>
                <TableCell sx={{ color: '#666' }}>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(company)} sx={{ color: '#667eea' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(company.id)} sx={{ color: '#f5576c' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? 'Modifier' : 'Nouvelle'} Entreprise</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de l'entreprise"
            fullWidth
            value={currentCompany.name}
            onChange={(e) => setCurrentCompany({ ...currentCompany, name: e.target.value })}
          />
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

export default CompanyManagement;
