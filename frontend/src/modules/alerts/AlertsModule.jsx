import { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Chip, IconButton, Badge } from '@mui/material';
import { Warning, CheckCircle, Notifications } from '@mui/icons-material';
import websocketService from '../../services/websocket';

const AlertsModule = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    websocketService.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      websocketService.off('new_alert');
    };
  }, []);

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'info',
      medium: 'warning',
      high: 'error',
      critical: 'error'
    };
    return colors[severity] || 'default';
  };

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Alertes</Typography>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </Box>

      <Card>
        <CardContent>
          <List>
            {alerts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography color="textSecondary">Aucune alerte</Typography>
              </Box>
            ) : (
              alerts.map((alert) => (
                <ListItem
                  key={alert.id}
                  sx={{ bgcolor: alert.read ? 'transparent' : 'action.hover', borderRadius: 1, mb: 1 }}
                  secondaryAction={
                    !alert.read && (
                      <IconButton edge="end" onClick={() => markAsRead(alert.id)}>
                        <CheckCircle />
                      </IconButton>
                    )
                  }
                >
                  <Warning sx={{ mr: 2, color: `${getSeverityColor(alert.severity)}.main` }} />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{alert.message}</Typography>
                        <Chip label={alert.severity} size="small" color={getSeverityColor(alert.severity)} />
                      </Box>
                    }
                    secondary={`${alert.vehicle} - ${new Date(alert.timestamp).toLocaleString()}`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AlertsModule;
