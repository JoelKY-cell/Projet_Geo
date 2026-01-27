import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import {
  DirectionsCar, Speed, LocalGasStation, Warning, People, Assignment, TrendingUp
} from '@mui/icons-material';
import { dashboardAPI } from '../services/api';

const AdminDashboard = () => {
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
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Tableau de bord Administrateur</Typography>
      
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Véhicules actifs" value={stats?.vehicles?.active || 0} 
            icon={<DirectionsCar fontSize="large" />} color="success" 
            subtitle={`Total: ${stats?.vehicles?.total || 0}`} />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Conducteurs actifs" value={stats?.drivers?.active_sessions || 0}
            icon={<People fontSize="large" />} color="info"
            subtitle={`Total: ${stats?.drivers?.total || 0}`} />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Alertes non traitées" value={stats?.alerts?.unacknowledged || 0}
            icon={<Warning fontSize="large" />} color="warning"
            subtitle={`Total: ${stats?.alerts?.total || 0}`} />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Rapports générés" value={stats?.reports?.total || 0}
            icon={<Assignment fontSize="large" />} color="secondary" />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <StatCard title="Distance aujourd'hui" value={`${stats?.trips?.total_distance || 0} km`}
            icon={<Speed fontSize="large" />} color="primary"
            subtitle={`Trajets: ${stats?.trips?.today_count || 0}`} />
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <StatCard title="Vitesse moyenne" value={`${stats?.trips?.avg_speed || 0} km/h`}
            icon={<TrendingUp fontSize="large" />} color="info" />
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <StatCard title="Événements carburant" value={stats?.fuel?.events_today || 0}
            icon={<LocalGasStation fontSize="large" />} color="error"
            subtitle={`Vols détectés: ${stats?.fuel?.theft_events || 0}`} />
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Alertes récentes</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Véhicule</TableCell>
                      <TableCell>Sévérité</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats?.alerts?.recent?.slice(0, 5).map((alert, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>{alert.vehicle}</TableCell>
                        <TableCell>{alert.severity}</TableCell>
                      </TableRow>
                    )) || <TableRow><TableCell colSpan={3}>Aucune alerte</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Statistiques système</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>Boîtiers GPS: {stats?.devices?.total || 0}</Typography>
                <Typography>Capteurs carburant: {stats?.devices?.fuel_sensors || 0}</Typography>
                <Typography>Capteurs RFID: {stats?.devices?.rfid_sensors || 0}</Typography>
                <Typography>Utilisateurs: {stats?.users?.total || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
