import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Business, People, Devices, TrendingUp, Notifications as NotificationsIcon, Speed, CloudDone, CheckCircle, Warning as WarningIcon } from '@mui/icons-material';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.43.35:8000/api';

const SystemAdminDashboard = () => {
  const [stats, setStats] = useState({ companies: 0, totalUsers: 0, totalAdmins: 0, systemHealth: 100 });
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [companiesRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/companies/`, { headers }),
        axios.get(`${API_BASE_URL}/users/`, { headers })
      ]);
      
      const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.results || [];
      setCompanies(companiesRes.data);
      setStats({
        companies: companiesRes.data.length,
        totalUsers: users.length,
        totalAdmins: users.filter(u => u.role === 'admin').length,
        systemHealth: 100
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

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
            <h1 style={{ color: '#0f172a', margin: 0, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Centre de Contrôle</h1>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '13px', fontWeight: '400' }}>Plateforme GPS Tanga • Vue d'ensemble système</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}>
              <NotificationsIcon sx={{ fontSize: 20, color: '#64748b' }} />
              <div style={{ position: 'absolute', top: 8, right: 8, background: '#10b981', borderRadius: '50%', width: 7, height: 7, border: '2px solid white' }}></div>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              padding: '10px 20px', 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '600', letterSpacing: '0.3px' }}>TANGA GROUP</span>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <StatCard title="Entreprises" value={stats.companies} icon={Business} color="#3b82f6" trend="up" trendValue="+12%" />
          <StatCard title="Administrateurs" value={stats.totalAdmins} icon={People} color="#8b5cf6" trend="up" trendValue="+5" />
          <StatCard title="Utilisateurs" value={stats.totalUsers} icon={Devices} color="#10b981" trend="up" trendValue="+23%" />
          <StatCard title="Performance" value={`${stats.systemHealth}%`} icon={Speed} color="#f59e0b" trend="up" trendValue="Optimal" />
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', marginBottom: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Companies Table */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '20px', 
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: '700', letterSpacing: '-0.3px' }}>Entreprises Actives</h3>
                <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748b', fontWeight: '400' }}>{companies.length} entreprises enregistrées</p>
              </div>
              <button 
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s',
                  letterSpacing: '0.3px'
                }} 
                onClick={() => navigate('/companies')}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)'; }}>
                + Nouvelle
              </button>
            </div>
            
            <div style={{ maxHeight: '420px', overflowY: 'auto', marginRight: '-16px', paddingRight: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'rgba(255, 255, 255, 0.95)', zIndex: 1 }}>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Entreprise</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Users</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} style={{ background: '#f8fafc', borderRadius: '12px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'scale(1.01)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'scale(1)'; }}>
                      <td style={{ padding: '16px', fontSize: '15px', color: '#0f172a', fontWeight: '600', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>{company.name}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{company.admin_name || '-'}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600' }}>{company.user_count || 0}</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                        <span style={{ 
                          background: company.is_active ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                          color: 'white', 
                          padding: '6px 14px', 
                          borderRadius: '10px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }}></div>
                          {company.is_active ? 'ACTIF' : 'INACTIF'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            {/* Map */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '20px', 
              padding: '28px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
              height: '400px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700', letterSpacing: '-0.3px' }}>Carte</h3>
              <div style={{ height: 'calc(100% - 32px)', borderRadius: '12px', overflow: 'hidden' }}>
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
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* System Metrics */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '20px', 
              padding: '28px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudDone style={{ fontSize: '24px' }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>Métriques Système</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Connexions actives', value: '0', icon: '🔗' },
                  { label: 'Positions/min', value: '0', icon: '📍' },
                  { label: 'Charge serveur', value: '12%', icon: '⚡' },
                  { label: 'Uptime', value: '99.9%', icon: '✓' }
                ].map((metric, i) => (
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
                      <span style={{ fontSize: '18px' }}>{metric.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{metric.label}</span>
                    </div>
                    <strong style={{ fontSize: '18px', fontWeight: '700' }}>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '20px', 
              padding: '28px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700', letterSpacing: '-0.3px' }}>Activité Récente</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: Business, title: 'Nouvelle entreprise', time: 'Il y a 2h', color: '#3b82f6' },
                  { icon: People, title: 'Admin ajouté', time: 'Il y a 5h', color: '#8b5cf6' },
                  { icon: Devices, title: '15 véhicules connectés', time: 'Il y a 1j', color: '#10b981' },
                  { icon: CheckCircle, title: 'Mise à jour système', time: 'Il y a 2j', color: '#f59e0b' }
                ].map((activity, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px', 
                    padding: '14px', 
                    borderRadius: '12px',
                    background: '#f8fafc',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: activity.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${activity.color}30` }}>
                      <activity.icon style={{ fontSize: '20px', color: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>{activity.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            { icon: '📊', title: 'Rapports', color: '#3b82f6' },
            { icon: '⚙️', title: 'Configuration', color: '#8b5cf6' },
            { icon: '🔒', title: 'Sécurité', color: '#ef4444' },
            { icon: '📈', title: 'Analytiques', color: '#10b981' }
          ].map((action, i) => (
            <button key={i} style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '24px', 
              borderRadius: '16px', 
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = 'translateY(-4px)'; 
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(31, 38, 135, 0.2)';
              e.currentTarget.style.borderColor = action.color;
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = 'translateY(0)'; 
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(31, 38, 135, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: `0 4px 16px ${action.color}40` }}>
                {action.icon}
              </div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', letterSpacing: '0.2px' }}>{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default SystemAdminDashboard;
