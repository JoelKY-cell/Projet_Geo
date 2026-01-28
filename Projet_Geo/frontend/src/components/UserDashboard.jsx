import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, CircularProgress
} from '@mui/material';
import {
  DirectionsCar, Speed, Map, InfoOutlined
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
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  }

  const StatCard = ({ title, value, icon, gradient }) => (
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
        <Typography variant="h3" fontWeight="700">{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ background: '#f5f7fa', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="700" mb={3} color="#2d3748">
          Tableau de bord
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StatCard 
              title="Véhicules actifs" 
              value={stats?.vehicles?.active || 0}
              icon={<DirectionsCar sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StatCard 
              title="Total véhicules" 
              value={stats?.vehicles?.total || 0}
              icon={<DirectionsCar sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StatCard 
              title="Distance aujourd'hui" 
              value={`${stats?.trips?.total_distance || 0} km`}
              icon={<Speed sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <StatCard 
              title="Trajets du jour" 
              value={stats?.trips?.today_count || 0}
              icon={<Map sx={{ fontSize: 40, opacity: 0.9 }} />}
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            />
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <InfoOutlined sx={{ fontSize: 32 }} />
                  <Typography variant="h6" fontWeight="600">
                    Informations
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Utilisez le menu pour consulter les positions des véhicules sur la carte 
                  et accéder à l'historique des trajets.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;
