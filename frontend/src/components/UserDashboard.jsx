import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DirectionsCar, Speed, Map, TrendingUp, Notifications as NotificationsIcon, InfoOutlined } from '@mui/icons-material';
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

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(20px)',
      borderRadius: '12px', 
      padding: '14px 16px', 
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }} 
    onMouseEnter={(e) => { 
      e.currentTarget.style.transform = 'translateY(-4px)'; 
      e.currentTarget.style.boxShadow = '0 12px 36px rgba(31, 38, 135, 0.2)';
    }} 
    onMouseLeave={(e) => { 
      e.currentTarget.style.transform = 'translateY(0)'; 
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.15)';
    }}>
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '55px', height: '55px', background: color, opacity: 0.1, borderRadius: '50%' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${color}40` }}>
          <Icon style={{ fontSize: '20px', color: 'white' }} />
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '500', marginBottom: '5px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>{value}</div>
    </div>
  );

  return (
    <Box sx={{ 
      background: '#f1f5f9', 
      minHeight: '100vh', 
      p: 4, 
      pl: 4, 
      pr: 0, 
      m: 0, 
      width: '100%',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{ width: '100%', margin: '0', padding: '0 20px 0 0', maxWidth: '1200px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#0f172a', margin: 0, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Tableau de bord</h1>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '13px', fontWeight: '400' }}>Vue d'ensemble de vos véhicules</p>
          </div>
          <div style={{ 
            position: 'relative', 
            cursor: 'pointer', 
            background: 'white', 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <NotificationsIcon sx={{ fontSize: 20, color: '#64748b' }} />
          </div>
        </div>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <StatCard title="Véhicules actifs" value={stats?.vehicles?.active || 0} icon={DirectionsCar} color="#3b82f6" />
          <StatCard title="Total véhicules" value={stats?.vehicles?.total || 0} icon={DirectionsCar} color="#8b5cf6" />
          <StatCard title="Distance aujourd'hui" value={`${stats?.trips?.total_distance || 0} km`} icon={Speed} color="#10b981" />
          <StatCard title="Trajets du jour" value={stats?.trips?.today_count || 0} icon={Map} color="#f59e0b" />
        </div>

        {/* Info Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '16px', 
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <InfoOutlined style={{ fontSize: '28px' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.3px' }}>Informations</h3>
          </div>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>
            Utilisez le menu pour consulter les positions des véhicules sur la carte en temps réel 
            et accéder à l'historique complet des trajets.
          </p>
        </div>
      </div>
    </Box>
  );
};

export default UserDashboard;
