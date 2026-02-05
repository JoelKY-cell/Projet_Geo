import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DirectionsCar, Speed, Warning, Person, TrendingUp, Notifications as NotificationsIcon } from '@mui/icons-material';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(20px)',
      borderRadius: '12px', 
      padding: '12px 14px', 
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
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '50px', height: '50px', background: color, opacity: 0.1, borderRadius: '50%' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${color}40` }}>
          <Icon style={{ fontSize: '18px', color: 'white' }} />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '2px 6px', borderRadius: '12px', background: trend === 'up' ? '#10b98120' : '#ef444420', color: trend === 'up' ? '#10b981' : '#ef4444', fontSize: '9px', fontWeight: '600' }}>
            <TrendingUp style={{ fontSize: '10px', transform: trend === 'down' ? 'rotate(180deg)' : 'none' }} />
            {trendValue}
          </div>
        )}
      </div>
      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '500', marginBottom: '4px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>{value}</div>
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
      <div style={{ width: '100%', margin: '0', padding: '0 20px 0 0' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#0f172a', margin: 0, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Tableau de bord Superviseur</h1>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '13px', fontWeight: '400' }}>Supervision de la flotte</p>
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
            <div style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', borderRadius: '50%', width: 7, height: 7, border: '2px solid white' }}></div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <StatCard title="Véhicules actifs" value={stats?.vehicles?.active || 0} icon={DirectionsCar} color="#3b82f6" trend="up" trendValue={`${stats?.vehicles?.total || 0} total`} />
          <StatCard title="Conducteurs" value={stats?.drivers?.total || 0} icon={Person} color="#8b5cf6" trendValue={`${stats?.drivers?.active_sessions || 0} actifs`} />
          <StatCard title="Alertes" value={stats?.alerts?.unacknowledged || 0} icon={Warning} color="#ef4444" />
          <StatCard title="Distance du jour" value={`${stats?.trips?.total_distance || 0} km`} icon={Speed} color="#10b981" />
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Map */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(20px)',
            borderRadius: '16px', 
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
            height: '500px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700', letterSpacing: '-0.3px' }}>Carte en temps réel</h3>
            <div style={{ height: 'calc(100% - 40px)', borderRadius: '12px', overflow: 'hidden' }}>
              <MapContainer 
                center={[-6.1659, 35.7516]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
            </div>
          </div>

          {/* Fleet Stats */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)', 
            backdropFilter: 'blur(20px)',
            borderRadius: '16px', 
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            color: 'white'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>Statistiques flotte</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Trajets aujourd\'hui', value: stats?.trips?.today_count || 0, icon: '🚗' },
                { label: 'Vitesse moyenne', value: `${stats?.trips?.avg_speed || 0} km/h`, icon: '⚡' },
                { label: 'Événements carburant', value: stats?.fuel?.events_today || 0, icon: '⛽' },
                { label: 'Boîtiers GPS', value: stats?.devices?.total || 0, icon: '📡' }
              ].map((item, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '16px', 
                  background: 'rgba(255, 255, 255, 0.15)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
                  </div>
                  <strong style={{ fontSize: '18px', fontWeight: '700' }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default SupervisorDashboard;
