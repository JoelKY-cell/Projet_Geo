import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, CircularProgress
} from '@mui/material';
import {
  DirectionsCar, Speed, Map
} from '@mui/icons-material';
import { dashboardAPI } from '../services/api';

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>{title}</Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <Box color={`${color}.main`}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Tableau de bord</Typography>
      
      <Grid container spacing={3}>
        <Grid xs={12} sm={6}>
          <StatCard 
            title="Véhicules actifs" 
            value={stats?.vehicles?.active || 0}
            icon={<DirectionsCar fontSize="large" />} 
            color="success" 
          />
        </Grid>
        
        <Grid xs={12} sm={6}>
          <StatCard 
            title="Total véhicules" 
            value={stats?.vehicles?.total || 0}
            icon={<DirectionsCar fontSize="large" />} 
            color="primary" 
          />
        </Grid>
        
        <Grid xs={12} sm={6}>
          <StatCard 
            title="Distance aujourd'hui" 
            value={`${stats?.trips?.total_distance || 0} km`}
            icon={<Speed fontSize="large" />} 
            color="info" 
          />
        </Grid>
        
        <Grid xs={12} sm={6}>
          <StatCard 
            title="Trajets du jour" 
            value={stats?.trips?.today_count || 0}
            icon={<Map fontSize="large" />} 
            color="secondary" 
          />
        </Grid>

        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Informations</Typography>
              <Typography variant="body2" color="textSecondary">
                Utilisez le menu pour consulter les positions des véhicules sur la carte 
                et accéder à l'historique des trajets.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard;
