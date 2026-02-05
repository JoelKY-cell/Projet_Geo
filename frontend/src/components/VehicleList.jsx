import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { vehicleAPI } from '../services/api';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    license_plate: '',
    vehicle_type: '',
    brand: '',
    model: '',
    year: '',
    fuel_capacity: '',
    is_active: true
  });

  const vehicleTypes = [
    { value: 'car', label: 'Véhicule' },
    { value: 'motorcycle', label: 'Moto' },
    { value: 'truck', label: 'Camion' },
    { value: 'equipment', label: 'Engin' },
    { value: 'other', label: 'Autre' }
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll();
      setVehicles(response.data.results || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle.id, formData);
      } else {
        await vehicleAPI.create(formData);
      }
      fetchVehicles();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        await vehicleAPI.delete(id);
        fetchVehicles();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData(vehicle);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingVehicle(null);
    setFormData({
      license_plate: '',
      vehicle_type: '',
      brand: '',
      model: '',
      year: '',
      fuel_capacity: '',
      is_active: true
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Gestion des véhicules
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Ajouter un véhicule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Immatriculation</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Marque/Modèle</TableCell>
              <TableCell>Année</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.license_plate}</TableCell>
                <TableCell>
                  {vehicleTypes.find(t => t.value === vehicle.vehicle_type)?.label}
                </TableCell>
                <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>
                  <Chip 
                    label={vehicle.is_active ? 'Actif' : 'Inactif'}
                    color={vehicle.is_active ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(vehicle)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(vehicle.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Immatriculation"
            margin="normal"
            value={formData.license_plate}
            onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
            required
          />
          <TextField
            fullWidth
            select
            label="Type de véhicule"
            margin="normal"
            value={formData.vehicle_type}
            onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
            required
          >
            {vehicleTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Marque"
            margin="normal"
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
          />
          <TextField
            fullWidth
            label="Modèle"
            margin="normal"
            value={formData.model}
            onChange={(e) => setFormData({...formData, model: e.target.value})}
          />
          <TextField
            fullWidth
            label="Année"
            type="number"
            margin="normal"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
          />
          <TextField
            fullWidth
            label="Capacité carburant (L)"
            type="number"
            margin="normal"
            value={formData.fuel_capacity}
            onChange={(e) => setFormData({...formData, fuel_capacity: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVehicle ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehicleList;