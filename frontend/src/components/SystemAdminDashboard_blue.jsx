import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Business, DirectionsCar, People, Warning } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.43.35:8000/api';

const SystemAdminDashboard = () => {
  const [stats, setStats] = useState({ companies: 0, totalUsers: 0, totalAdmins: 0, systemHealth: 100 });
  const [companies, setCompanies] = useState([]);

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
        systemHealth: 90
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, gradient }) => (
    <div style={{ background: gradient, borderRadius: '20px', padding: '30px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '140px', opacity: 0.1 }}>
        <Icon style={{ fontSize: 'inherit' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px' }}>{value}</div>
        <div style={{ fontSize: '15px', opacity: 0.95, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>{title}</div>
      </div>
    </div>
  );

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', minHeight: '100vh', p: 4 }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '42px', fontWeight: '800', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>Système d'Administration</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '8px 0 0 0', fontSize: '16px' }}>Gestion globale de la plateforme GPS</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>● SYSTÈME ACTIF</span>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px' }}>
          <StatCard title="Entreprises" value={stats.companies} icon={Business} gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
          <StatCard title="Admins" value={stats.totalAdmins} icon={People} gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" />
          <StatCard title="Utilisateurs" value={stats.totalUsers} icon={DirectionsCar} gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" />
          <StatCard title="Santé" value={`${stats.systemHealth}%`} icon={Warning} gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <h3 style={{ margin: 0, fontSize: '22px', color: '#fff', fontWeight: '700' }}>Entreprises Enregistrées</h3>
              <button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>+ Nouvelle</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <th style={{ textAlign: 'left', padding: '15px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Entreprise</th>
                  <th style={{ textAlign: 'left', padding: '15px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin</th>
                  <th style={{ textAlign: 'center', padding: '15px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Users</th>
                  <th style={{ textAlign: 'center', padding: '15px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '18px 10px', fontSize: '15px', color: '#fff', fontWeight: '600' }}>{company.name}</td>
                    <td style={{ padding: '18px 10px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{company.admin_name || '-'}</td>
                    <td style={{ padding: '18px 10px', textAlign: 'center' }}>
                      <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: '700' }}>{company.user_count || 0}</span>
                    </td>
                    <td style={{ padding: '18px 10px', textAlign: 'center' }}>
                      <span style={{ background: company.is_active ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                        {company.is_active ? '● ACTIVE' : '● INACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', marginBottom: '25px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#fff', fontWeight: '700' }}>Actions Rapides</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '18px', borderRadius: '15px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', textAlign: 'left', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', transition: 'transform 0.2s', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>📊 Rapports Système</button>
                <button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '18px', borderRadius: '15px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', textAlign: 'left', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', transition: 'transform 0.2s', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>⚙️ Configuration</button>
                <button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '18px', borderRadius: '15px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', textAlign: 'left', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', transition: 'transform 0.2s', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>🔒 Sécurité</button>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', color: 'white', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>Métriques Temps Réel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                  <span style={{ fontSize: '14px' }}>Connexions actives</span>
                  <strong style={{ fontSize: '16px' }}>0</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                  <span style={{ fontSize: '14px' }}>Positions/min</span>
                  <strong style={{ fontSize: '16px' }}>0</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                  <span style={{ fontSize: '14px' }}>Charge serveur</span>
                  <strong style={{ fontSize: '16px' }}>12%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default SystemAdminDashboard;
