import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Alert
} from '@mui/material';
import { Assessment, GetApp } from '@mui/icons-material';

const Reports = () => {
  const [reportConfig, setReportConfig] = useState({
    report_type: '',
    format: 'pdf',
    start_date: '',
    end_date: '',
    vehicle: '',
    driver: ''
  });
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { value: 'vehicle', label: 'Rapport véhicule' },
    { value: 'driver', label: 'Rapport conducteur' },
    { value: 'fleet', label: 'Rapport flotte' },
    { value: 'fuel', label: 'Rapport carburant' },
    { value: 'alerts', label: 'Rapport alertes' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' }
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Simulation de génération de rapport
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Rapport généré avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Génération de rapports
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration du rapport
              </Typography>
              
              <TextField
                fullWidth
                select
                label="Type de rapport"
                margin="normal"
                value={reportConfig.report_type}
                onChange={(e) => setReportConfig({...reportConfig, report_type: e.target.value})}
                required
              >
                {reportTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Format"
                margin="normal"
                value={reportConfig.format}
                onChange={(e) => setReportConfig({...reportConfig, format: e.target.value})}
                required
              >
                {formats.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Date de début"
                type="date"
                margin="normal"
                value={reportConfig.start_date}
                onChange={(e) => setReportConfig({...reportConfig, start_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                fullWidth
                label="Date de fin"
                type="date"
                margin="normal"
                value={reportConfig.end_date}
                onChange={(e) => setReportConfig({...reportConfig, end_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Assessment />}
                  onClick={handleGenerate}
                  disabled={generating || !reportConfig.report_type || !reportConfig.start_date || !reportConfig.end_date}
                >
                  {generating ? 'Génération en cours...' : 'Générer le rapport'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Types de rapports disponibles
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Les rapports incluent les données de géolocalisation, consommation de carburant, 
                alertes et comportements de conduite selon le type sélectionné.
              </Alert>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  📊 Rapport véhicule
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Trajets, distances, vitesses, consommation par véhicule
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  👤 Rapport conducteur
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Historique de conduite, véhicules utilisés, comportements
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  🚗 Rapport flotte
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Vue d'ensemble de tous les véhicules et statistiques globales
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  ⛽ Rapport carburant
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Consommation, pleins, anomalies détectées
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  ⚠️ Rapport alertes
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Historique des alertes et incidents
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;