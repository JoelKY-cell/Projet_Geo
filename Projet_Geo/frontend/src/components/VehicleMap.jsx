import { useState, useEffect } from 'react';
import { Box, CircularProgress, Card, CardContent, Typography, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trackingAPI } from '../services/api';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VehicleMap = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await trackingAPI.getCurrentPositions();
        setPositions(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des positions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const center = positions.length > 0 
    ? [positions[0].latitude, positions[0].longitude] 
    : [-6.1659, 35.7516];

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
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#0f172a', margin: 0, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Carte en temps réel</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '13px', fontWeight: '400' }}>Géolocalisation des véhicules • Actualisation toutes les 10s</p>
        </div>

        {/* Map */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '16px', 
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
          height: 'calc(100vh - 200px)'
        }}>
          <div style={{ height: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer 
              center={center} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {positions.map((position) => (
                <Marker 
                  key={position.id} 
                  position={[position.latitude, position.longitude]}
                >
                  <Popup>
                    <Card sx={{ minWidth: 200, boxShadow: 'none' }}>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 700, mb: 1 }}>
                          {position.vehicle_name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>
                          Vitesse: {position.speed} km/h
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#64748b', mb: 1 }}>
                          {new Date(position.timestamp).toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Chip 
                            label={position.engine_on ? 'ON' : 'OFF'} 
                            color={position.engine_on ? 'success' : 'default'}
                            size="small"
                            sx={{ fontSize: '10px', height: '20px' }}
                          />
                          <Chip 
                            label={`${position.speed} km/h`} 
                            color={position.speed > 80 ? 'warning' : 'primary'}
                            size="small"
                            sx={{ fontSize: '10px', height: '20px' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {positions.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              Aucune position récente disponible
            </Typography>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default VehicleMap;
