import React, { useState } from 'react';
import { 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  Map as MapIcon,
  DirectionsCar as CarIcon,
  Assessment as ReportIcon,
  ExitToApp as LogoutIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  GpsFixed as GpsIcon,
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const Sidebar = ({ setIsAuthenticated, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const drawerWidth = expanded ? 260 : 80;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  const menuItems = [
    { path: '/', label: 'Tableau de bord', icon: <DashboardIcon />, roles: ['super_admin', 'admin', 'supervisor', 'user'] },
    { path: '/map', label: 'Carte en temps réel', icon: <MapIcon />, roles: ['admin', 'supervisor', 'user'] },
    { path: '/vehicles', label: 'Véhicules', icon: <CarIcon />, roles: ['admin', 'supervisor'] },
    { path: '/history', label: 'Historique', icon: <HistoryIcon />, roles: ['admin', 'supervisor', 'user'] },
    { path: '/companies', label: 'Entreprises', icon: <BusinessIcon />, roles: ['super_admin'] },
    { path: '/users', label: 'Utilisateurs', icon: <PeopleIcon />, roles: ['super_admin', 'admin', 'supervisor'] },
    { path: '/alerts', label: 'Alertes', icon: <NotificationsIcon />, roles: ['admin', 'supervisor', 'user'] },
    { path: '/reports', label: 'Rapports', icon: <ReportIcon />, roles: ['admin', 'supervisor', 'user'] },
    { path: '/settings', label: 'Paramètres', icon: <SettingsIcon />, roles: ['super_admin', 'admin', 'supervisor', 'user'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const NavMenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Tooltip title={!expanded ? item.label : ''} placement="right" arrow>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: '10px',
              py: 1.4,
              px: expanded ? 2 : 1.5,
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              justifyContent: expanded ? 'flex-start' : 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: isActive ? '70%' : '0%',
                background: '#F59E0B',
                borderRadius: '0 4px 4px 0',
                transition: 'height 0.3s'
              },
              backgroundColor: isActive ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: isActive ? 'rgba(245, 158, 11, 0.12)' : 'rgba(30, 58, 138, 0.04)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive ? '#F59E0B' : '#6B7280', 
              minWidth: expanded ? 40 : 'auto',
              transition: 'color 0.3s',
              justifyContent: 'center'
            }}>
              {item.icon}
            </ListItemIcon>
            {expanded && (
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#111827' : '#6B7280',
                    transition: 'all 0.3s'
                  }
                }} 
              />
            )}
          </ListItemButton>
        </ListItem>
      </Tooltip>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#FFFFFF',
          color: '#111827',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #E5E7EB',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
    >
      {/* Logo Section */}
      <Box sx={{ 
        p: expanded ? 3 : 2, 
        pb: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: expanded ? 'space-between' : 'center',
        gap: 1.5,
        borderBottom: '1px solid #E5E7EB'
      }}>
        {expanded ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #1E3A8A 0%, #10B981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)'
              }}>
                <GpsIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#111827', lineHeight: 1.2 }}>
                  Tanga GPS
                </Typography>
                <Typography sx={{ color: '#6B7280', fontSize: '11px', mt: 0.3, fontWeight: 500 }}>
                  Suivi en temps réel
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => setExpanded(!expanded)}
              sx={{ 
                width: 32, 
                height: 32,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <IconButton 
            onClick={() => setExpanded(!expanded)}
            sx={{ 
              width: 40, 
              height: 40,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              '&:hover': { 
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                transform: 'scale(1.05)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ 
        px: expanded ? 2 : 1.5, 
        pt: 2, 
        flex: 1, 
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#E5E7EB',
          borderRadius: '3px',
        }
      }}>
        {expanded && (
          <Typography sx={{ 
            px: 2, 
            mb: 1.5, 
            fontSize: '11px', 
            fontWeight: 700, 
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '0.8px'
          }}>
            Navigation
          </Typography>
        )}
        <List sx={{ p: 0 }}>
          {filteredMenuItems.map((item) => (
            <NavMenuItem key={item.path} item={item} />
          ))}
          
          {/* Profil avec sous-menu */}
          <Tooltip title={!expanded ? 'Profil' : ''} placement="right" arrow>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setProfileOpen(!profileOpen)}
                sx={{
                  borderRadius: '10px',
                  py: 1.4,
                  px: expanded ? 2 : 1.5,
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  justifyContent: expanded ? 'flex-start' : 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(30, 58, 138, 0.04)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#6B7280', 
                  minWidth: expanded ? 40 : 'auto',
                  transition: 'color 0.3s',
                  justifyContent: 'center'
                }}>
                  <AccountCircleIcon />
                </ListItemIcon>
                {expanded && (
                  <>
                    <ListItemText 
                      primary="Profil" 
                      sx={{ 
                        '& .MuiTypography-root': {
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#6B7280',
                          transition: 'all 0.3s'
                        }
                      }} 
                    />
                    {profileOpen ? <ExpandLessIcon sx={{ color: '#6B7280' }} /> : <ExpandMoreIcon sx={{ color: '#6B7280' }} />}
                  </>
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
          
          <Collapse in={profileOpen && expanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                onClick={() => navigate('/profile')}
                sx={{
                  pl: 6,
                  py: 1,
                  borderRadius: '10px',
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(30, 58, 138, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonIcon fontSize="small" sx={{ color: '#6B7280' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Mon compte" 
                  sx={{ 
                    '& .MuiTypography-root': {
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#6B7280'
                    }
                  }} 
                />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: expanded ? 2 : 1.5, pt: 1, borderTop: '1px solid #E5E7EB' }}>
        <Tooltip title={!expanded ? 'Déconnexion' : ''} placement="right" arrow>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: '10px',
              py: 1.4,
              px: expanded ? 2 : 1.5,
              justifyContent: expanded ? 'flex-start' : 'center',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: '#EF4444', 
              minWidth: expanded ? 40 : 'auto',
              justifyContent: 'center'
            }}>
              <LogoutIcon />
            </ListItemIcon>
            {expanded && (
              <ListItemText 
                primary="Déconnexion" 
                sx={{ 
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#EF4444'
                  }
                }} 
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
