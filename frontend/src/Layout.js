import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Button, Tooltip, useMediaQuery, Alert, CircularProgress, Divider } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Payment from '@mui/icons-material/Payment';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2, mt: 1 }}>
    <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', textAlign: 'center', width: '100%' }}>
      IPMS
    </Typography>
  </Box>
);

const navLinks = [
  { label: 'Inventory', icon: <InventoryIcon />, href: '/inventory' },
  { label: 'Orders', icon: <AssignmentIcon />, href: '/orders' },
  { label: 'Suppliers', icon: <PeopleIcon />, href: '/suppliers' },
  { label: 'Reports', icon: <ReportIcon />, href: '/reports' },
  { label: 'Notifications', icon: <NotificationsIcon />, href: '/notifications' },
  { label: 'Audit Logs', icon: <HistoryIcon />, href: '/audit-logs' },
  { label: 'User Management', icon: <PeopleIcon />, href: '/users' },
  { label: 'Payments', icon: <Payment />, href: '/payments' },
];

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Helper to get page name from pathname
function getPageTitle(pathname) {
  if (pathname === '/dashboard' || pathname === '/') return 'Dashboard';
  const found = navLinks.find(link => link.href === pathname);
  return found ? found.label : '';
}

export default function Layout({ children }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // User info state
  const [user, setUser] = useState({ username: '', role: '' });
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      setUserLoading(true);
      setUserError('');
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${API_URL}/api/users/me/`, { headers });
        if (res.ok) {
          const data = await res.json();
          setUser({ username: data.username, role: data.role });
        } else {
          setUserError('Failed to fetch user info');
        }
      } catch (err) {
        setUserError('Network error fetching user info');
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const drawer = (
    <Box
      sx={{
        width: 240,
        bgcolor: 'primary.main',
        minHeight: '100vh',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        boxShadow: 2,
        pt: 0,
      }}
    >
      <Box sx={{ width: '100%', pt: 1, pb: 1 }}>
        <Logo />
        <Divider sx={{ my: 1 }} />
        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.label}
              component="a"
              href={link.href}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                transition: 'background 0.2s, color 0.2s',
                '&:hover': { bgcolor: 'primary.light', color: 'primary.main', boxShadow: 1 },
                '&.Mui-selected, &.Mui-selected:hover': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  boxShadow: 2,
                },
              }}
              selected={location.pathname === link.href}
            >
              <Tooltip title={link.label} placement="right">
                <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>{link.icon}</ListItemIcon>
              </Tooltip>
              <ListItemText primary={link.label} sx={{ ml: -2, fontWeight: 700, color: '#fff', fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2rem' }, letterSpacing: 0.5 }} />
            </ListItem>
          ))}
        </List>
      </Box>
      {/* User Greeting and Logout at the bottom */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ width: '100%', p: 2, textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
          {userLoading ? 'Loading...' : `Welcome, ${user.username || 'User'}`}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ mt: 1, fontWeight: 700, width: '100%' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  // Get the current page title
  const pageTitle = getPageTitle(location.pathname);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Sidebar Drawer */}
      {isDesktop ? (
        <Drawer variant="permanent" open sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', bgcolor: 'primary.main' } }}>
          {drawer}
        </Drawer>
      ) : (
        <Drawer variant="temporary" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ '& .MuiDrawer-paper': { width: 240, bgcolor: 'primary.main' } }}>
          {drawer}
        </Drawer>
      )}
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
        {/* AppBar */}
        <AppBar position="static" color="primary" elevation={2} sx={{ boxShadow: '0 2px 8px 0 rgba(24,49,83,0.08)' }}>
          <Toolbar
            sx={{
              minWidth: 0,
              px: { xs: 1, sm: 2 },
              pl: { xs: !isDesktop ? 1 : 0, md: isDesktop ? 30 : 0 },
              alignItems: 'center',
              display: 'flex',
            }}
          >
            {!isDesktop && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 1, '&:hover': { bgcolor: 'primary.light' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: { xs: '1.1rem', sm: '1.5rem', md: '2rem' },
                letterSpacing: 1,
                textAlign: 'left',
                ml: 0,
              }}
            >
              {pageTitle}
            </Typography>
          </Toolbar>
          <Divider />
        </AppBar>
        {/* Page Content */}
        <Box sx={{ mt: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
} 