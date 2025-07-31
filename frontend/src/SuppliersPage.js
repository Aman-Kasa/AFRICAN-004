import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Stack
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function SupplierForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || {
    name: '', contact_name: '', contact_email: '', contact_phone: '', address: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initialData || {
      name: '', contact_name: '', contact_email: '', contact_phone: '', address: ''
    });
    setError('');
  }, [open, initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name) {
      setError('Name is required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
        <TextField margin="dense" label="Contact Name" name="contact_name" value={form.contact_name} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Contact Email" name="contact_email" value={form.contact_email} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Contact Phone" name="contact_phone" value={form.contact_phone} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Address" name="address" value={form.address} onChange={handleChange} fullWidth multiline rows={2} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch suppliers with backend search/filter
  const fetchSuppliers = async (name = searchName, contact = searchContact, email = searchEmail) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      let url = `${API_URL}/api/suppliers/`;
      const params = [];
      if (name) params.push(`name=${encodeURIComponent(name)}`);
      if (contact) params.push(`contact_name=${encodeURIComponent(contact)}`);
      if (email) params.push(`contact_email=${encodeURIComponent(email)}`);
      if (params.length) url += `?${params.join('&')}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        setError('Failed to fetch suppliers.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  // Debounced search/filter
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => fetchSuppliers(), 400));
    // eslint-disable-next-line
  }, [searchName, searchContact, searchEmail]);

  const handleAdd = async (supplier) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/suppliers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(supplier),
      });
      if (response.ok) {
        setFormOpen(false);
        setSuccessMsg('Supplier added successfully.');
        fetchSuppliers();
      } else {
        setError('Failed to add supplier.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleEdit = async (supplier) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(supplier),
      });
      if (response.ok) {
        setEditSupplier(null);
        setSuccessMsg('Supplier updated successfully.');
        fetchSuppliers();
      } else {
        setError('Failed to update supplier.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/suppliers/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setSuccessMsg('Supplier deleted successfully.');
        fetchSuppliers();
      } else {
        setError('Failed to delete supplier.');
      }
    } catch {
      setError('Network error.');
    }
  };

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1300, mx: 'auto', my: 5, borderRadius: 4 }}>
      <Typography variant="h3" fontWeight={900} gutterBottom color="primary.main" sx={{ letterSpacing: 1, mb: 3 }}>
        Suppliers
      </Typography>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={isMobile ? 'stretch' : 'center'} mb={3}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setFormOpen(true)} disabled={loading} size="large">
          Add Supplier
        </Button>
        <TextField
          label="Name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          size="medium"
          placeholder="Search by name"
          disabled={loading}
          sx={{ width: isMobile ? '100%' : undefined, bgcolor: '#f4f6fa', borderRadius: 2 }}
        />
        <TextField
          label="Contact"
          value={searchContact}
          onChange={e => setSearchContact(e.target.value)}
          size="medium"
          placeholder="Search by contact"
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
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Contact Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Contact Email</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Contact Phone</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Address</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Created</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Updated</TableCell>
                <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier, idx) => (
                <TableRow
                  key={supplier.id}
                  sx={{
                    bgcolor: idx % 2 === 0 ? '#f7fafd' : '#e3eafc',
                    '&:hover': { bgcolor: '#e0f2ff' },
                  }}
                >
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contact_name}</TableCell>
                  <TableCell>{supplier.contact_email}</TableCell>
                  <TableCell>{supplier.contact_phone}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>{new Date(supplier.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(supplier.updated_at).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => setEditSupplier(supplier)} disabled={loading}>
                      <Tooltip title="Edit">
                        <Edit />
                      </Tooltip>
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(supplier.id)} disabled={loading}>
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
      <SupplierForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} />
      <SupplierForm open={!!editSupplier} onClose={() => setEditSupplier(null)} onSubmit={handleEdit} initialData={editSupplier} />
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