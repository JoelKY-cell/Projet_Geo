import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, CircularProgress,
  List, ListItem, ListItemText, Chip
} from '@mui/material';
import {
  DirectionsCar, Speed, Warning, Person
} from '@mui/icons-material';
import { dashboardAPI } from '../services/api';

const SupervisorDashboard = () => {
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

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>{title}</Typography>
            <Typography variant="h4">{value}</Typography>
            {subtitle && <Typography variant="body2" color="textSecondary">{subtitle}</Typography>}
          </Box>
          <Box color={`${color}.main`}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Tableau de bord Superviseur</Typography>
      
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Véhicules actifs" value={stats?.vehicles?.active || 0}
            icon={<DirectionsCar fontSize="large" />} color="success"
            subtitle={`Total: ${stats?.vehicles?.total || 0}`} />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Conducteurs" value={stats?.drivers?.total || 0}
            icon={<Person fontSize="large" />} color="info"
            subtitle={`En service: ${stats?.drivers?.active_sessions || 0}`} />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Alertes" value={stats?.alerts?.unacknowledged || 0}
            icon={<Warning fontSize="large" />} color="warning"
            subtitle="À traiter" />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Distance du jour" value={`${stats?.trips?.total_distance || 0} km`}
            icon={<Speed fontSize="large" />} color="primary" />
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Alertes actives</Typography>
              <List>
                {stats?.alerts?.recent?.slice(0, 5).map((alert, idx) => (
                  <ListItem key={idx}>
                    <ListItemText 
                      primary={alert.type}
                      secondary={`Véhicule: ${alert.vehicle}`}
                    />
                    <Chip 
                      label={alert.severity} 
                      color={alert.severity === 'high' ? 'error' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                )) || <ListItem><ListItemText primary="Aucune alerte" /></ListItem>}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Statistiques flotte</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>Trajets aujourd'hui: {stats?.trips?.today_count || 0}</Typography>
                <Typography>Vitesse moyenne: {stats?.trips?.avg_speed || 0} km/h</Typography>
                <Typography>Événements carburant: {stats?.fuel?.events_today || 0}</Typography>
                <Typography>Boîtiers GPS: {stats?.devices?.total || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SupervisorDashboard;
