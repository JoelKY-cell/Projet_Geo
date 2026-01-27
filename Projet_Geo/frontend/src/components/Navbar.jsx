import React from 'react';
import { 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  Map as MapIcon,
  DirectionsCar as CarIcon,
  Assessment as ReportIcon,
  ExitToApp as LogoutIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ setIsAuthenticated, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  const menuItems = [
    { path: '/', label: 'Tableau de bord', icon: <DashboardIcon />, roles: ['admin', 'supervisor', 'user'] },
    { path: '/map', label: 'Carte', icon: <MapIcon />, roles: ['admin', 'supervisor', 'user'] },
    { path: '/vehicles', label: 'Véhicules', icon: <CarIcon />, roles: ['admin', 'supervisor'] },
    { path: '/reports', label: 'Rapports', icon: <ReportIcon />, roles: ['admin', 'supervisor', 'user'] },
    { path: '/users', label: 'Utilisateurs', icon: <PeopleIcon />, roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#e3f2fd',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap>
          Plateforme GPS
        </Typography>
      </Box>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;