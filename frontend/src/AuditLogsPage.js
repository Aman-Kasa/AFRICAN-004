import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, TextField, Stack, Chip, IconButton, Tooltip, Button, Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import BackupIcon from '@mui/icons-material/Backup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Action type configurations for styling and icons
const ACTION_TYPES = {
  CREATE: { color: 'success', label: 'Created', icon: <AddIcon /> },
  UPDATE: { color: 'primary', label: 'Updated', icon: <EditIcon /> },
  DELETE: { color: 'error', label: 'Deleted', icon: <DeleteIcon /> },
  APPROVE: { color: 'success', label: 'Approved', icon: <CheckCircleIcon /> },
  REJECT: { color: 'error', label: 'Rejected', icon: <CancelIcon /> },
  LOGIN: { color: 'info', label: 'Login', icon: <LoginIcon /> },
  LOGOUT: { color: 'warning', label: 'Logout', icon: <LoginIcon /> },
  EXPORT: { color: 'secondary', label: 'Exported', icon: <DownloadIcon /> },
  IMPORT: { color: 'secondary', label: 'Imported', icon: <DownloadIcon /> },
  BACKUP: { color: 'info', label: 'Backup', icon: <BackupIcon /> },
  MAINTENANCE: { color: 'warning', label: 'Maintenance', icon: <SettingsIcon /> }
};

/**
 * AuditLogsPage component
 * Fetches and displays audit logs from the backend with enhanced features.
 */
export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [searchAction, setSearchAction] = useState('');
  const [searchObjectType, setSearchObjectType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch audit logs from backend with search/filter
  const fetchLogs = async (user = searchUser, action = searchAction, objectType = searchObjectType, start = startDate, end = endDate) => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('accessToken');
    let url = `${API_URL}/api/audit-logs/`;
    const params = [];
    if (user) params.push(`user=${encodeURIComponent(user)}`);
    if (action) params.push(`action=${encodeURIComponent(action)}`);
    if (objectType) params.push(`object_type=${encodeURIComponent(objectType)}`);
    if (start) params.push(`start_date=${start.toISOString().split('T')[0]}`);
    if (end) params.push(`end_date=${end.toISOString().split('T')[0]}`);
    if (params.length) url += `?${params.join('&')}`;
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        setError('Failed to fetch audit logs.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  // Debounced search/filter
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => fetchLogs(), 400));
    // eslint-disable-next-line
  }, [searchUser, searchAction, searchObjectType, startDate, endDate]);

  const getActionColor = (action) => {
    return ACTION_TYPES[action]?.color || 'default';
  };

  const getActionLabel = (action) => {
    return ACTION_TYPES[action]?.label || action;
  };

  const getActionIcon = (action) => {
    return ACTION_TYPES[action]?.icon || <SettingsIcon />;
  };

  const clearFilters = () => {
    setSearchUser('');
    setSearchAction('');
    setSearchObjectType('');
    setStartDate(null);
    setEndDate(null);
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    const today = new Date().toDateString();
    const stats = {
      total: logs.length,
      today: logs.filter(log => 
        new Date(log.created_at).toDateString() === today
      ).length,
      systemActions: logs.filter(log => log.user === 'System' || !log.user).length,
      userActions: logs.filter(log => log.user && log.user !== 'System').length,
      thisWeek: logs.filter(log => {
        const logDate = new Date(log.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return logDate >= weekAgo;
      }).length
    };
    return stats;
  };

  // Export logs to CSV
  const exportLogs = () => {
    const headers = ['User', 'Action', 'Object Type', 'Object ID', 'Message', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        log.user || 'System',
        log.action,
        log.object_type,
        log.object_id,
        `"${log.message.replace(/"/g, '""')}"`,
        log.created_at
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getSummaryStats();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1400, mx: 'auto', my: 5, borderRadius: 4 }}>
        <Typography variant="h3" fontWeight={900} gutterBottom color="primary.main" sx={{ letterSpacing: 1, mb: 3 }}>
          Audit Logs
        </Typography>
        
        {/* Summary Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
              <Typography variant="h3" fontWeight={700}>{stats.total}</Typography>
              <Typography variant="body1">Total Logs</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white', borderRadius: 3 }}>
              <Typography variant="h3" fontWeight={700}>{stats.today}</Typography>
              <Typography variant="body1">Today</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.main', color: 'white', borderRadius: 3 }}>
              <Typography variant="h3" fontWeight={700}>{stats.thisWeek}</Typography>
              <Typography variant="body1">This Week</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.main', color: 'white', borderRadius: 3 }}>
              <Typography variant="h3" fontWeight={700}>{stats.userActions}</Typography>
              <Typography variant="body1">User Actions</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Search and Filter Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#f8f9fa' }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <FilterListIcon color="primary" />
            <Typography variant="h6" fontWeight={600} color="primary.main">
              Search & Filter
            </Typography>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Tooltip title="Export to CSV">
                <IconButton 
                  onClick={exportLogs}
                  size="small"
                  color="success"
                  disabled={logs.length === 0}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear all filters">
                <IconButton 
                  onClick={clearFilters}
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh logs">
                <IconButton 
                  onClick={() => fetchLogs()}
                  size="small"
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="User"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                size="medium"
                placeholder="Search by username"
                disabled={loading}
                fullWidth
                sx={{ 
                  bgcolor: '#fff', 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="medium">
                <InputLabel>Action Type</InputLabel>
                <Select
                  value={searchAction}
                  label="Action Type"
                  onChange={e => setSearchAction(e.target.value)}
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#fff', 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: 'primary.main' }
                    }
                  }}
                >
                  <MenuItem value="">All Actions</MenuItem>
                  {Object.keys(ACTION_TYPES).map(action => (
                    <MenuItem key={action} value={action}>
                      {ACTION_TYPES[action].label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Object Type"
                value={searchObjectType}
                onChange={e => setSearchObjectType(e.target.value)}
                size="medium"
                placeholder="Search by object type"
                disabled={loading}
                fullWidth
                sx={{ 
                  bgcolor: '#fff', 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="medium"
                    sx={{ 
                      bgcolor: '#fff', 
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: 'primary.main' }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="medium"
                    sx={{ 
                      bgcolor: '#fff', 
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: 'primary.main' }
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Results Summary */}
        {!loading && !error && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {logs.length} audit log{logs.length !== 1 ? 's' : ''}
            </Typography>
            {(searchUser || searchAction || searchObjectType || startDate || endDate) && (
              <Chip 
                label="Filters applied" 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            )}
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : logs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <FilterListIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No audit logs found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchUser || searchAction || searchObjectType || startDate || endDate
                ? 'Try adjusting your search criteria.' 
                : 'No audit logs have been created yet.'
              }
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto', borderRadius: 3, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>User</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Action</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Object Type</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Object ID</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Message</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, idx) => (
                  <TableRow
                    key={log.id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? '#f7fafd' : '#e3eafc',
                      '&:hover': { bgcolor: '#e0f2ff' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={600} color="primary.main">
                        {log.user || 'System'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getActionIcon(log.action)}
                        label={getActionLabel(log.action)}
                        color={getActionColor(log.action)}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {log.object_type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                        {log.object_id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {log.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(log.created_at).toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </LocalizationProvider>
  );
} 