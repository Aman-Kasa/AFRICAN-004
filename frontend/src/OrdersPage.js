import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem, Snackbar, Tooltip, Stack
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function OrderForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || { supplier: '', item: '', quantity: 1 });
  const [error, setError] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    setForm(initialData || { supplier: '', item: '', quantity: 1 });
    setError('');
    setLoadingOptions(true);
    const token = localStorage.getItem('accessToken');
    Promise.all([
      fetch(`${API_URL}/api/suppliers/`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/api/inventory/items/`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.ok ? r.json() : [])
    ]).then(([suppliersData, itemsData]) => {
      setSuppliers(suppliersData);
      setItems(itemsData);
      setLoadingOptions(false);
    }).catch(() => setLoadingOptions(false));
  }, [open, initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.supplier || !form.item) {
      setError('Supplier and Item are required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Order' : 'Add Order'}</DialogTitle>
      <DialogContent>
        {loadingOptions ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              margin="dense"
              label="Supplier"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              fullWidth
              required
            >
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              margin="dense"
              label="Item"
              name="item"
              value={form.item}
              onChange={handleChange}
              fullWidth
              required
            >
              {items.map((i) => (
                <MenuItem key={i.id} value={i.name}>{i.name}</MenuItem>
              ))}
            </TextField>
            <TextField margin="dense" label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} fullWidth />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loadingOptions}>{initialData ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchSupplier, setSearchSupplier] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch orders with backend search/filter
  const fetchOrders = async (supplier = searchSupplier, item = searchItem, status = searchStatus) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      let url = `${API_URL}/api/orders/`;
      const params = [];
      if (supplier) params.push(`supplier=${encodeURIComponent(supplier)}`);
      if (item) params.push(`item=${encodeURIComponent(item)}`);
      if (status) params.push(`status=${encodeURIComponent(status)}`);
      if (params.length) url += `?${params.join('&')}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setError('Failed to fetch orders.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Debounced search/filter
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => fetchOrders(), 400));
    // eslint-disable-next-line
  }, [searchSupplier, searchItem, searchStatus]);

  const handleAdd = async (order) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(order),
      });
      if (response.ok) {
        setFormOpen(false);
        setSuccessMsg('Order added successfully.');
        fetchOrders();
      } else {
        setError('Failed to add order.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleEdit = async (order) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/orders/${order.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(order),
      });
      if (response.ok) {
        setEditOrder(null);
        setSuccessMsg('Order updated successfully.');
        fetchOrders();
      } else {
        setError('Failed to update order.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setSuccessMsg('Order deleted successfully.');
        fetchOrders();
      } else {
        setError('Failed to delete order.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleAction = async (id, action) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}/action/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        setSuccessMsg(`Order ${action}d successfully.`);
        fetchOrders();
      } else {
        setError('Failed to update order status.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/orders/export/csv/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders_export.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setSuccessMsg('Orders CSV exported successfully.');
      } else {
        setError('Failed to export CSV.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1300, mx: 'auto', my: 5, borderRadius: 4 }}>
      <Typography variant="h3" fontWeight={900} gutterBottom color="primary.main" sx={{ letterSpacing: 1, mb: 3 }}>
        Purchase Orders
      </Typography>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={isMobile ? 'stretch' : 'center'} mb={3}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setFormOpen(true)} disabled={loading} size="large">
          Add Order
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCSV} disabled={exporting || loading} size="large">
          {exporting ? 'Exporting...' : 'Export Orders CSV'}
        </Button>
        <TextField
          label="Supplier"
          value={searchSupplier}
          onChange={e => setSearchSupplier(e.target.value)}
          size="medium"
          sx={{ width: isMobile ? '100%' : 180, bgcolor: '#f4f6fa', borderRadius: 2 }}
          placeholder="Search supplier"
          disabled={loading}
        />
        <TextField
          label="Item"
          value={searchItem}
          onChange={e => setSearchItem(e.target.value)}
          size="medium"
          sx={{ width: isMobile ? '100%' : 180, bgcolor: '#f4f6fa', borderRadius: 2 }}
          placeholder="Search item"
          disabled={loading}
        />
        <TextField
          label="Status"
          value={searchStatus}
          onChange={e => setSearchStatus(e.target.value)}
          size="medium"
          sx={{ width: isMobile ? '100%' : 140, bgcolor: '#f4f6fa', borderRadius: 2 }}
          placeholder="Status (PENDING, APPROVED, REJECTED)"
          disabled={loading}
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
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Supplier</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Item</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Quantity</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Status</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Created</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Updated</TableCell>
                <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow
                  key={order.id}
                  sx={{
                    bgcolor: idx % 2 === 0 ? '#f7fafd' : '#e3eafc',
                    '&:hover': { bgcolor: '#e0f2ff' },
                  }}
                >
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{order.item}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    <Typography color={
                      order.status === 'APPROVED' ? 'success.main' :
                      order.status === 'REJECTED' ? 'error.main' : 'warning.main'
                    } fontWeight={700}>
                      {order.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(order.updated_at).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => setEditOrder(order)} disabled={loading}>
                      <Tooltip title="Edit">
                        <Edit />
                      </Tooltip>
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(order.id)} disabled={loading}>
                      <Tooltip title="Delete">
                        <Delete />
                      </Tooltip>
                    </IconButton>
                    {order.status === 'PENDING' && (
                      <>
                        <IconButton color="success" onClick={() => handleAction(order.id, 'approve')} disabled={loading}>
                          <Tooltip title="Approve">
                            <CheckCircle />
                          </Tooltip>
                        </IconButton>
                        <IconButton color="error" onClick={() => handleAction(order.id, 'reject')} disabled={loading}>
                          <Tooltip title="Reject">
                            <Cancel />
                          </Tooltip>
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <OrderForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} />
      <OrderForm open={!!editOrder} onClose={() => setEditOrder(null)} onSubmit={handleEdit} initialData={editOrder} />
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