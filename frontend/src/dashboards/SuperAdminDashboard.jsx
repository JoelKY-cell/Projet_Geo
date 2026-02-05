import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Business, DirectionsCar, People, Warning, Map as MapIcon, Speed, LocalGasStation } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.43.35:8000/api';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({ companies: 0, totalVehicles: 0, totalUsers: 0, activeAlerts: 0 });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [companiesRes] = await Promise.all([axios.get(`${API_BASE_URL}/companies/`, { headers })]);
      setCompanies(companiesRes.data);
      setStats({
        companies: companiesRes.data.length,
        totalVehicles: companiesRes.data.reduce((acc, c) => acc + (c.vehicle_count || 0), 0),
        totalUsers: companiesRes.data.reduce((acc, c) => acc + (c.user_count || 0), 0),
        activeAlerts: 0
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{ background: 'white', borderRadius: '4px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '70px', opacity: 0.15, color }}>
        <Icon style={{ fontSize: 'inherit' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>{value}</div>
        <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>{title}</div>
      </div>
      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: `2px solid ${color}` }}>
        <a href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '12px' }}>Plus d'infos →</a>
      </div>
    </div>
  );

  const QuickButton = ({ icon: Icon, label, color }) => (
    <div style={{ background: color, color: 'white', padding: '12px', borderRadius: '4px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <Icon style={{ fontSize: '35px' }} />
      <div style={{ fontSize: '13px', marginTop: '5px', fontWeight: '500' }}>{label}</div>
    </div>
  );

  return (
    <Box sx={{ background: '#ecf0f5', minHeight: '100vh', p: 3 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '24px' }}>Dashboard Super Admin</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <StatCard title="Entreprises" value={stats.companies} icon={Business} color="#00c0ef" />
          <StatCard title="Véhicules" value={stats.totalVehicles} icon={DirectionsCar} color="#00a65a" />
          <StatCard title="Utilisateurs" value={stats.totalUsers} icon={People} color="#f39c12" />
          <StatCard title="Alertes Actives" value={stats.activeAlerts} icon={Warning} color="#dd4b39" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '4px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333', borderBottom: '1px solid #f4f4f4', paddingBottom: '10px' }}>Entreprises Clientes</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f4f4f4' }}>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '13px', color: '#666' }}>Nom</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '13px', color: '#666' }}>Admin</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontSize: '13px', color: '#666' }}>Users</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontSize: '13px', color: '#666' }}>Statut</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontSize: '13px', color: '#666' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                    <td style={{ padding: '10px 8px', fontSize: '13px' }}>{company.name}</td>
                    <td style={{ padding: '10px 8px', fontSize: '13px' }}>{company.admin_name || '-'}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span style={{ background: '#3c8dbc', color: 'white', padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>{company.user_count || 0}</span>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span style={{ background: company.is_active ? '#00a65a' : '#999', color: 'white', padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>
                        {company.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: '13px' }}>{new Date(company.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div style={{ background: 'white', borderRadius: '4px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333', borderBottom: '1px solid #f4f4f4', paddingBottom: '10px' }}>Accès Rapides</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <QuickButton icon={MapIcon} label="Carte Globale" color="#3c8dbc" />
                <QuickButton icon={Speed} label="Tracking Live" color="#00a65a" />
                <QuickButton icon={LocalGasStation} label="Carburant" color="#f39c12" />
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '4px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', color: 'white' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Statistiques Système</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '13px' }}>Boîtiers GPS</span>
                  <strong>0</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '13px' }}>Positions/jour</span>
                  <strong>0</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '13px' }}>Alertes/jour</span>
                  <strong>0</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default SuperAdminDashboard;
