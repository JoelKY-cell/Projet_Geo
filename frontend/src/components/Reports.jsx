import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Assessment, PictureAsPdf, TableChart, CalendarToday, TrendingUp } from '@mui/icons-material';

const Reports = () => {
  const [reportConfig, setReportConfig] = useState({
    report_type: '',
    format: 'pdf',
    start_date: '',
    end_date: ''
  });
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { value: 'vehicle', label: 'Rapport véhicule', icon: '🚗', color: '#3b82f6', desc: 'Trajets, distances, vitesses' },
    { value: 'driver', label: 'Rapport conducteur', icon: '👤', color: '#8b5cf6', desc: 'Historique de conduite' },
    { value: 'fleet', label: 'Rapport flotte', icon: '🚛', color: '#10b981', desc: 'Vue d\'ensemble globale' },
    { value: 'fuel', label: 'Rapport carburant', icon: '⛽', color: '#f59e0b', desc: 'Consommation et pleins' },
    { value: 'alerts', label: 'Rapport alertes', icon: '⚠️', color: '#ef4444', desc: 'Historique des incidents' }
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Rapport généré avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setGenerating(false);
    }
  };

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
      <div style={{ width: '100%', margin: '0', padding: '0 20px 0 0', maxWidth: '1400px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)' }}>
                <Assessment style={{ fontSize: '28px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ color: '#0f172a', margin: 0, fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>Génération de rapports</h1>
                <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px', fontWeight: '400' }}>Sélectionnez un type de rapport</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Report Types Grid */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            {reportTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => setReportConfig({...reportConfig, report_type: type.value})}
                style={{
                  background: reportConfig.report_type === type.value ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: reportConfig.report_type === type.value ? `2px solid ${type.color}` : '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: reportConfig.report_type === type.value ? `0 8px 32px ${type.color}30` : '0 4px 16px rgba(31, 38, 135, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${type.color}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = reportConfig.report_type === type.value ? `0 8px 32px ${type.color}30` : '0 4px 16px rgba(31, 38, 135, 0.1)'; }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{type.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '3px' }}>{type.label}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>{type.desc}</div>
                {reportConfig.report_type === type.value && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderRadius: '50%', background: type.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700' }}>✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)' }}>
            <h3 style={{ color: '#0f172a', fontSize: '15px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.3px' }}>Configuration du rapport</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date de début</label>
                <div style={{ position: 'relative' }}>
                  <CalendarToday style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }} />
                  <input
                    type="date"
                    value={reportConfig.start_date}
                    onChange={(e) => setReportConfig({...reportConfig, start_date: e.target.value})}
                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '12px', fontWeight: '500', color: '#0f172a', background: '#f8fafc', transition: 'all 0.3s', outline: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date de fin</label>
                <div style={{ position: 'relative' }}>
                  <CalendarToday style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }} />
                  <input
                    type="date"
                    value={reportConfig.end_date}
                    onChange={(e) => setReportConfig({...reportConfig, end_date: e.target.value})}
                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '12px', fontWeight: '500', color: '#0f172a', background: '#f8fafc', transition: 'all 0.3s', outline: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Format d'export</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { value: 'pdf', label: 'PDF', icon: <PictureAsPdf /> },
                  { value: 'excel', label: 'Excel', icon: <TableChart /> }
                ].map((format) => (
                  <div
                    key={format.value}
                    onClick={() => setReportConfig({...reportConfig, format: format.value})}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: reportConfig.format === format.value ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                      background: reportConfig.format === format.value ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onMouseLeave={(e) => { if (reportConfig.format !== format.value) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    <span style={{ color: reportConfig.format === format.value ? '#3b82f6' : '#64748b' }}>{format.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: reportConfig.format === format.value ? '#3b82f6' : '#64748b' }}>{format.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !reportConfig.report_type || !reportConfig.start_date || !reportConfig.end_date}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: generating || !reportConfig.report_type || !reportConfig.start_date || !reportConfig.end_date ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: generating || !reportConfig.report_type || !reportConfig.start_date || !reportConfig.end_date ? 'not-allowed' : 'pointer',
                boxShadow: generating || !reportConfig.report_type || !reportConfig.start_date || !reportConfig.end_date ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => { if (!generating && reportConfig.report_type && reportConfig.start_date && reportConfig.end_date) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(59, 130, 246, 0.5)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = generating || !reportConfig.report_type || !reportConfig.start_date || !reportConfig.end_date ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.4)'; }}
            >
              <Assessment style={{ fontSize: '20px' }} />
              {generating ? 'Génération en cours...' : 'Générer le rapport'}
            </button>
          </div>

          {/* Stats Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', backdropFilter: 'blur(20px)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <TrendingUp style={{ fontSize: '22px' }} />
                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>Rapports générés</h3>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>247</div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>Ce mois-ci</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)' }}>
              <h4 style={{ color: '#0f172a', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>Rapports populaires</h4>
              {[
                { name: 'Flotte', count: 89, color: '#10b981' },
                { name: 'Véhicule', count: 76, color: '#3b82f6' },
                { name: 'Carburant', count: 52, color: '#f59e0b' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid #e2e8f0' : 'none' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{item.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: item.color }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Reports;