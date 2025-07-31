import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, Badge, List, ListItem, ListItemText, ListItemSecondaryAction, 
  CircularProgress, Alert, Button, Paper, Stack, Chip, Divider, Grid, Card, CardContent,
  Fade, Slide, Avatar, Tooltip, useMediaQuery
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Enhanced notification type configurations
const NOTIFICATION_TYPES = {
  INFO: { 
    color: 'primary', 
    icon: InfoIcon, 
    label: 'Info',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: 'white'
  },
  WARNING: { 
    color: 'warning', 
    icon: WarningIcon, 
    label: 'Warning',
    bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: 'white'
  },
  ALERT: { 
    color: 'error', 
    icon: ErrorIcon, 
    label: 'Alert',
    bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    textColor: 'white'
  }
};

/**
 * Enhanced NotificationsPanel component
 * Beautiful, modern notifications interface with animations and fancy styling.
 */
export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [markingId, setMarkingId] = useState(null);
  const [showUnread, setShowUnread] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch notifications from backend
  useEffect(() => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('accessToken');
    fetch(`${API_URL}/api/notifications/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch notifications.');
        setLoading(false);
      });
  }, [refresh]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setRefresh(r => r + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark a notification as read
  const markAsRead = async (id) => {
    setMarkingId(id);
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`${API_URL}/api/notifications/${id}/read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSuccessMsg('Notification marked as read.');
      setRefresh((r) => r + 1);
    } catch {
      setError('Failed to mark as read.');
    } finally {
      setMarkingId(null);
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    setMarkingId(id);
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`${API_URL}/api/notifications/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSuccessMsg('Notification deleted.');
      setRefresh((r) => r + 1);
    } catch {
      setError('Failed to delete notification.');
    } finally {
      setMarkingId(null);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`${API_URL}/api/notifications/mark-all-read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSuccessMsg('All notifications marked as read.');
      setRefresh((r) => r + 1);
    } catch {
      setError('Failed to mark all as read.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const readNotifications = notifications.filter((n) => n.is_read);

  const getNotificationIcon = (type) => {
    const IconComponent = NOTIFICATION_TYPES[type]?.icon || InfoIcon;
    return <IconComponent />;
  };

  const getNotificationColor = (type) => {
    return NOTIFICATION_TYPES[type]?.color || 'default';
  };

  const getNotificationStyle = (type, isRead = false) => {
    const config = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.INFO;
    return {
      background: isRead ? 'rgba(255,255,255,0.9)' : config.bgColor,
      color: isRead ? 'text.primary' : config.textColor,
      border: isRead ? '1px solid #e0e0e0' : 'none',
      opacity: isRead ? 0.8 : 1,
    };
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header Section */}
      <Paper 
        elevation={4} 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          mb: 4, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem' } }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <NotificationsIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: 1 }}>
                Notifications
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                Stay updated with real-time alerts and system messages
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {unreadCount > 0 && (
              <Button 
                variant="contained" 
                startIcon={<DoneAllIcon />}
                onClick={markAllAsRead}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  fontWeight: 600
                }}
              >
                Mark All Read
              </Button>
            )}
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={() => setRefresh((r) => r + 1)}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                fontWeight: 600
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Box>
        
        {/* Decorative elements */}
        <Box sx={{ 
          position: 'absolute', 
          top: -20, 
          right: -20, 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          bgcolor: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: -30, 
          left: -30, 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          bgcolor: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }} />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : notifications.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Fade in={true} timeout={1000}>
            <Box>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.light', 
                mx: 'auto', 
                mb: 2 
              }}>
                <NotificationsIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                All Caught Up! 🎉
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No new notifications at the moment. You're all set!
              </Typography>
            </Box>
          </Fade>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <Grid item xs={12} lg={6}>
              <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <Typography variant="h5" fontWeight={700}>
                      🔔 Unread ({unreadNotifications.length})
                    </Typography>
                  </Box>
                  <List sx={{ p: 0 }}>
                    {unreadNotifications.map((notif, index) => (
                      <Slide direction="up" in={true} timeout={300 + index * 100} key={notif.id}>
                        <ListItem 
                          sx={{ 
                            p: 3,
                            borderBottom: '1px solid #f0f0f0',
                            '&:last-child': { borderBottom: 'none' },
                            '&:hover': { 
                              bgcolor: '#f8f9fa',
                              transform: 'translateX(4px)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        >
                          <Avatar sx={{ 
                            mr: 2, 
                            bgcolor: `${getNotificationColor(notif.type)}.main`,
                            width: 40, 
                            height: 40 
                          }}>
                            {getNotificationIcon(notif.type)}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography fontWeight={600} variant="body1">
                                  {notif.message}
                                </Typography>
                                <Chip 
                                  label={NOTIFICATION_TYPES[notif.type]?.label || notif.type}
                                  size="small"
                                  color={getNotificationColor(notif.type)}
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {new Date(notif.created_at).toLocaleString()}
                              </Typography>
                            }
                          />
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Mark as read">
                              <IconButton 
                                color="success" 
                                onClick={() => markAsRead(notif.id)} 
                                disabled={markingId === notif.id}
                                sx={{ 
                                  bgcolor: 'success.light', 
                                  color: 'white',
                                  '&:hover': { bgcolor: 'success.main' }
                                }}
                              >
                                {markingId === notif.id ? <CircularProgress size={16} /> : <CheckIcon />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                color="error" 
                                onClick={() => deleteNotification(notif.id)}
                                disabled={markingId === notif.id}
                                sx={{ 
                                  bgcolor: 'error.light', 
                                  color: 'white',
                                  '&:hover': { bgcolor: 'error.main' }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </ListItem>
                      </Slide>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <Grid item xs={12} lg={6}>
              <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, bgcolor: 'grey.100' }}>
                    <Typography variant="h5" fontWeight={600} color="text.secondary">
                      📋 Read ({readNotifications.length})
                    </Typography>
                  </Box>
                  <List sx={{ p: 0 }}>
                    {readNotifications.map((notif, index) => (
                      <Fade in={true} timeout={500 + index * 100} key={notif.id}>
                        <ListItem 
                          sx={{ 
                            p: 3,
                            borderBottom: '1px solid #f0f0f0',
                            '&:last-child': { borderBottom: 'none' },
                            opacity: 0.7,
                            '&:hover': { 
                              opacity: 1, 
                              bgcolor: '#fafafa',
                              transform: 'translateX(4px)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        >
                          <Avatar sx={{ 
                            mr: 2, 
                            bgcolor: 'grey.400',
                            width: 40, 
                            height: 40 
                          }}>
                            {getNotificationIcon(notif.type)}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography fontWeight={400} variant="body1">
                                  {notif.message}
                                </Typography>
                                <Chip 
                                  label={NOTIFICATION_TYPES[notif.type]?.label || notif.type}
                                  size="small"
                                  color={getNotificationColor(notif.type)}
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {new Date(notif.created_at).toLocaleString()}
                              </Typography>
                            }
                          />
                          <Tooltip title="Delete">
                            <IconButton 
                              color="error" 
                              onClick={() => deleteNotification(notif.id)}
                              disabled={markingId === notif.id}
                              size="small"
                              sx={{ 
                                bgcolor: 'error.light', 
                                color: 'white',
                                '&:hover': { bgcolor: 'error.main' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItem>
                      </Fade>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg('')}
        message={successMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { borderRadius: 2 } }}
      />
    </Box>
  );
} 