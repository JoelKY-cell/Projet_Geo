import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { trackingAPI } from '../services/api';

const VehicleMap = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await trackingAPI.getCurrentPositions();
        setPositions(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des positions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 10000); // Actualisation toutes les 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Géolocalisation temps réel
      </Typography>
      
      <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="body1" color="info.contrastText">
           Intégration Google Maps/OpenStreetMap à venir
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {positions.map((position) => (
          <Grid item xs={12} md={6} lg={4} key={position.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {position.vehicle_name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Position: {position.latitude}, {position.longitude}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Vitesse: {position.speed} km/h
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Dernière mise à jour: {new Date(position.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={position.engine_on ? 'Moteur ON' : 'Moteur OFF'} 
                    color={position.engine_on ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip 
                    label={`${position.speed} km/h`} 
                    color={position.speed > 80 ? 'warning' : 'primary'}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {positions.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            Aucune position récente disponible
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default VehicleMap;