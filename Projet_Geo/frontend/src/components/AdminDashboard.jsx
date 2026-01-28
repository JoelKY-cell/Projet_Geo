import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
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
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  }

  const StatCard = ({ title, value, icon, gradient, subtitle }) => (
    <Card sx={{ 
      height: '100%',
      background: gradient,
      color: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>{title}</Typography>
          {icon}
        </Box>
        <Typography variant="h3" fontWeight="700" mb={0.5}>{value}</Typography>
        {subtitle && <Typography variant="body2" sx={{ opacity: 0.8 }}>{subtitle}</Typography>}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ background: '#f5f7fa', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="700" mb={3} color="#2d3748">
          Tableau de bord Administrateur
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Véhicules actifs" 
              value={stats?.vehicles?.active || 0}
              icon={<DirectionsCar sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              subtitle={`Total: ${stats?.vehicles?.total || 0}`}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Conducteurs actifs" 
              value={stats?.drivers?.active_sessions || 0}
              icon={<People sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              subtitle={`Total: ${stats?.drivers?.total || 0}`}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Alertes non traitées" 
              value={stats?.alerts?.unacknowledged || 0}
              icon={<Warning sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              subtitle={`Total: ${stats?.alerts?.total || 0}`}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Rapports générés" 
              value={stats?.reports?.total || 0}
              icon={<Assignment sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StatCard 
              title="Distance aujourd'hui" 
              value={`${stats?.trips?.total_distance || 0} km`}
              icon={<Speed sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
              subtitle={`Trajets: ${stats?.trips?.today_count || 0}`}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard 
              title="Vitesse moyenne" 
              value={`${stats?.trips?.avg_speed || 0} km/h`}
              icon={<TrendingUp sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard 
              title="Événements carburant" 
              value={stats?.fuel?.events_today || 0}
              icon={<LocalGasStation sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
              subtitle={`Vols: ${stats?.fuel?.theft_events || 0}`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" mb={2} color="#2d3748">
                  Alertes récentes
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Véhicule</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Sévérité</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats?.alerts?.recent?.slice(0, 5).map((alert, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>{alert.type}</TableCell>
                          <TableCell>{alert.vehicle}</TableCell>
                          <TableCell>
                            <Chip 
                              label={alert.severity} 
                              size="small"
                              color={alert.severity === 'high' ? 'error' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      )) || <TableRow><TableCell colSpan={3} align="center">Aucune alerte</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" mb={2} color="#2d3748">
                  Statistiques système
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary">Boîtiers GPS</Typography>
                    <Chip label={stats?.devices?.total || 0} color="primary" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary">Capteurs carburant</Typography>
                    <Chip label={stats?.devices?.fuel_sensors || 0} color="success" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary">Capteurs RFID</Typography>
                    <Chip label={stats?.devices?.rfid_sensors || 0} color="info" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary">Utilisateurs</Typography>
                    <Chip label={stats?.users?.total || 0} color="secondary" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
