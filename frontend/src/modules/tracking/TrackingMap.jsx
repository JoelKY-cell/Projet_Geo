import { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem, Button, Chip } from '@mui/material';
import { Refresh, PlayArrow, Pause } from '@mui/icons-material';
import websocketService from '../../services/websocket';

const TrackingMap = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [isLive, setIsLive] = useState(true);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Connexion WebSocket pour positions temps réel
    websocketService.connect('ws://192.168.43.35:8000/ws/tracking/');
    
    websocketService.on('position_update', (data) => {
      if (isLive) {
        setPositions(prev => [...prev, data]);
      }
    });

    return () => {
      websocketService.disconnect();
    };
  }, [isLive]);

  const toggleLive = () => {
    setIsLive(!isLive);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Suivi Temps Réel</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Véhicule</InputLabel>
            <Select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
              <MenuItem value="all">Tous les véhicules</MenuItem>
              {vehicles.map(v => (
                <MenuItem key={v.id} value={v.id}>{v.license_plate}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={isLive ? <Pause /> : <PlayArrow />} onClick={toggleLive}>
            {isLive ? 'Pause' : 'Live'}
          </Button>
          <Button variant="outlined" startIcon={<Refresh />}>Actualiser</Button>
        </Box>
      </Box>

      <Card sx={{ height: 'calc(100vh - 250px)' }}>
        <CardContent sx={{ height: '100%' }}>
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
            <Typography color="textSecondary">
              Carte interactive (Google Maps / Leaflet à intégrer)
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Chip label={`${vehicles.length} véhicules`} color="primary" />
        <Chip label={`${positions.length} positions`} color="success" />
        <Chip label={isLive ? 'LIVE' : 'PAUSE'} color={isLive ? 'error' : 'default'} />
      </Box>
    </Container>
  );
};

export default TrackingMap;
