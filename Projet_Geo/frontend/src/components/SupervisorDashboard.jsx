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
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="700" mb={3} color="#2d3748">
          Tableau de bord Superviseur
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
              title="Conducteurs" 
              value={stats?.drivers?.total || 0}
              icon={<Person sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              subtitle={`En service: ${stats?.drivers?.active_sessions || 0}`}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Alertes" 
              value={stats?.alerts?.unacknowledged || 0}
              icon={<Warning sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              subtitle="À traiter"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Distance du jour" 
              value={`${stats?.trips?.total_distance || 0} km`}
              icon={<Speed sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" mb={2} color="#2d3748">
                  Alertes actives
                </Typography>
                <List>
                  {stats?.alerts?.recent?.slice(0, 5).map((alert, idx) => (
                    <ListItem 
                      key={idx}
                      sx={{ 
                        borderRadius: '8px',
                        mb: 1,
                        bgcolor: '#f8f9fa',
                        '&:hover': { bgcolor: '#e9ecef' }
                      }}
                    >
                      <ListItemText 
                        primary={<Typography fontWeight="600">{alert.type}</Typography>}
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

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" mb={2} color="#2d3748">
                  Statistiques flotte
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary">Trajets aujourd'hui</Typography>
                    <Chip label={stats?.trips?.today_count || 0} color="primary" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary">Vitesse moyenne</Typography>
                    <Chip label={`${stats?.trips?.avg_speed || 0} km/h`} color="info" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary">Événements carburant</Typography>
                    <Chip label={stats?.fuel?.events_today || 0} color="success" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography color="textSecondary">Boîtiers GPS</Typography>
                    <Chip label={stats?.devices?.total || 0} color="secondary" />
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

export default SupervisorDashboard;
