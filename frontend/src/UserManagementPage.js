import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, Snackbar, Tooltip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const ROLES = ['ADMIN', 'MANAGER', 'STAFF'];

/**
 * UserManagementPage component
 * Admin can view, add, edit, and delete users.
 */
export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch users from backend with search/filter
  const fetchUsers = async (username = searchUsername, email = searchEmail) => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('accessToken');
    let url = `${API_URL}/api/users/admin/`;
    const params = [];
    if (username) params.push(`username=${encodeURIComponent(username)}`);
    if (email) params.push(`email=${encodeURIComponent(email)}`);
    if (params.length) url += `?${params.join('&')}`;
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setUsers(await response.json());
      } else {
        setError('Failed to fetch users.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Debounced search/filter
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => fetchUsers(), 400));
    // eslint-disable-next-line
  }, [searchUsername, searchEmail]);

  // Add or edit user
  const handleSubmit = async (user) => {
    const token = localStorage.getItem('accessToken');
    setError('');
    setLoading(true);
    try {
      let response;
      if (user.id) {
        response = await fetch(`${API_URL}/api/users/admin/${user.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(user),
        });
      } else {
        response = await fetch(`${API_URL}/api/users/admin/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(user),
        });
      }
      if (response.ok) {
        setFormOpen(false);
        setEditUser(null);
        setSuccessMsg(user.id ? 'User updated successfully.' : 'User added successfully.');
        fetchUsers();
      } else {
        setError('Failed to save user.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/admin/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setSuccessMsg('User deleted successfully.');
        fetchUsers();
      } else {
        setError('Failed to delete user.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1300, mx: 'auto', my: 5, borderRadius: 4 }}>
      <Typography variant="h3" fontWeight={900} gutterBottom color="primary.main" sx={{ letterSpacing: 1, mb: 3 }}>
        User Management
      </Typography>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={isMobile ? 'stretch' : 'center'} mb={3}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setFormOpen(true)} disabled={loading} size="large">
          Add User
        </Button>
        <TextField
          label="Username"
          value={searchUsername}
          onChange={e => setSearchUsername(e.target.value)}
          size="medium"
          placeholder="Search by username"
          disabled={loading}
          sx={{ width: isMobile ? '100%' : undefined, bgcolor: '#f4f6fa', borderRadius: 2 }}
        />
        <TextField
          label="Email"
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
          size="medium"
          placeholder="Search by email"
          disabled={loading}
          sx={{ width: isMobile ? '100%' : undefined, bgcolor: '#f4f6fa', borderRadius: 2 }}
        />
      </Stack>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto', borderRadius: 3, boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }} size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Username</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Email</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Role</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Active</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Staff</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Superuser</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Date Joined</TableCell>
                <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, idx) => (
                <TableRow
                  key={user.id}
                  sx={{
                    bgcolor: idx % 2 === 0 ? '#f7fafd' : '#e3eafc',
                    '&:hover': { bgcolor: '#e0f2ff' },
                  }}
                >
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{user.is_staff ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{user.is_superuser ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{new Date(user.date_joined).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => setEditUser(user)} disabled={loading}>
                      <Tooltip title="Edit">
                        <Edit />
                      </Tooltip>
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)} disabled={loading}>
                      <Tooltip title="Delete">
                        <Delete />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <UserForm open={formOpen || !!editUser} onClose={() => { setFormOpen(false); setEditUser(null); }} onSubmit={handleSubmit} initialData={editUser} />
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg('')}
        message={successMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
}

/**
 * UserForm component for add/edit user
 */
function UserForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || { username: '', email: '', role: 'STAFF', is_active: true });
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initialData || { username: '', email: '', role: 'STAFF', is_active: true });
    setError('');
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = () => {
    if (!form.username || !form.email) {
      setError('Username and email are required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="Username" name="username" value={form.username} onChange={handleChange} fullWidth required />
        <TextField margin="dense" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required />
        <TextField select margin="dense" label="Role" name="role" value={form.role} onChange={handleChange} fullWidth>
          {ROLES.map((role) => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </TextField>
        <TextField margin="dense" label="Active" name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} fullWidth />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
} 