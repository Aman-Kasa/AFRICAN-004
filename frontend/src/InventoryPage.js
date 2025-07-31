import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, Stack
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Snackbar from '@mui/material/Snackbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function InventoryForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || { name: '', sku: '', quantity: 0, reorder_level: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initialData || { name: '', sku: '', quantity: 0, reorder_level: 0 });
    setError('');
  }, [open, initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.sku) {
      setError('Name and SKU are required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Item' : 'Add Item'}</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
        <TextField margin="dense" label="SKU" name="sku" value={form.sku} onChange={handleChange} fullWidth required />
        <TextField margin="dense" label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Reorder Level" name="reorder_level" type="number" value={form.reorder_level} onChange={handleChange} fullWidth />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}

function QRScannerModal({ open, onClose, onScan }) {
  // DEMO: Simulate a scan after opening
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onScan('HLT-3003'); // Simulate scanning the Welding Helmet SKU
      }, 1200); // 1.2 seconds delay for realism
      return () => clearTimeout(timer);
    }
  }, [open, onScan]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Scan QR Code</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            (Demo) Simulating QR scan for SKU: <b>HLT-3003</b>...
          </Typography>
          <CircularProgress />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [qrOpen, setQrOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const fileInputRef = React.useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch items with backend search/filter
  const fetchItems = async (searchVal = search) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      let url = `${API_URL}/api/inventory/items/`;
      if (searchVal) {
        // Send both name and sku for flexible search
        url += `?name=${encodeURIComponent(searchVal)}&sku=${encodeURIComponent(searchVal)}`;
      }
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        setError('Failed to fetch inventory.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => fetchItems(search), 400));
    // eslint-disable-next-line
  }, [search]);

  const handleAdd = async (item) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/inventory/items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        setFormOpen(false);
        setSuccessMsg('Item added successfully.');
        fetchItems();
      } else {
        setError('Failed to add item.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleEdit = async (item) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/inventory/items/${item.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        setEditItem(null);
        setSuccessMsg('Item updated successfully.');
        fetchItems();
      } else {
        setError('Failed to update item.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/api/inventory/items/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setSuccessMsg('Item deleted successfully.');
        fetchItems();
      } else {
        setError('Failed to delete item.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleScan = (sku) => {
    setQrOpen(false);
    const found = items.find((item) => item.sku === sku);
    setScannedItem(found || { sku, notFound: true });
  };

  // Use dedicated stock-in/stock-out endpoints
  const handleStockChange = async (item, delta) => {
    if (!item || !item.id) return;
    const token = localStorage.getItem('accessToken');
    const endpoint = delta > 0 ? 'stock-in' : 'stock-out';
    try {
      const response = await fetch(`${API_URL}/api/inventory/items/${item.id}/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: Math.abs(delta) }),
      });
      if (response.ok) {
        setSuccessMsg(`Stock ${delta > 0 ? 'increased' : 'decreased'} successfully.`);
        fetchItems();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update stock.');
      }
    } catch {
      setError('Network error.');
    }
    setScannedItem(null);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/inventory/items/export/csv/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_export.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setSuccessMsg('CSV exported successfully.');
      } else {
        setError('Failed to export CSV.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setExporting(false);
    }
  };

  const handleImportCSV = () => {
    setImportResult(null);
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}/api/inventory/items/import/csv/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setImportResult(data);
        setSuccessMsg('CSV imported successfully.');
        fetchItems();
      } else {
        setError('Failed to import CSV.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  // Remove client-side filtering, rely on backend
  // const filteredItems = items.filter(
  //   (item) =>
  //     item.name.toLowerCase().includes(search.toLowerCase()) ||
  //     item.sku.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1300, mx: 'auto', my: 5, borderRadius: 4 }}>
      <Typography variant="h3" fontWeight={900} gutterBottom color="primary.main" sx={{ letterSpacing: 1, mb: 3 }}>
        Inventory
      </Typography>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={isMobile ? 'stretch' : 'center'} mb={3}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setFormOpen(true)} disabled={loading} size="large">
          Add Item
        </Button>
        <Button variant="outlined" startIcon={<QrCodeScannerIcon />} onClick={() => setQrOpen(true)} disabled={loading} size="large">
          Scan QR
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCSV} disabled={exporting || loading} size="large">
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
        <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handleImportCSV} disabled={importing || loading} size="large">
          {importing ? 'Importing...' : 'Import CSV'}
        </Button>
        <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mt: isMobile ? 2 : 0 }}>
          <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
          <TextField
            placeholder="Search by name or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="medium"
            sx={{ width: isMobile ? '100%' : 300, bgcolor: '#f4f6fa', borderRadius: 2 }}
            disabled={loading}
          />
        </Box>
      </Stack>
      {importResult && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Imported: {importResult.created} new, Updated: {importResult.updated} existing items.
        </Alert>
      )}
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
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>SKU</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Quantity</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Reorder Level</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Created</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Updated</TableCell>
                <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow
                  key={item.id}
                  sx={{
                    bgcolor: idx % 2 === 0 ? '#f7fafd' : '#e3eafc',
                    '&:hover': { bgcolor: '#e0f2ff' },
                  }}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: item.quantity <= item.reorder_level ? 'error.main' : 'success.main' }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell>{item.reorder_level}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => setEditItem(item)} disabled={loading}>
                      <Tooltip title="Edit">
                        <Edit />
                      </Tooltip>
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)} disabled={loading}>
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
      <InventoryForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} />
      <InventoryForm open={!!editItem} onClose={() => setEditItem(null)} onSubmit={handleEdit} initialData={editItem} />
      <QRScannerModal open={qrOpen} onClose={() => setQrOpen(false)} onScan={handleScan} />
      <Dialog open={!!scannedItem} onClose={() => setScannedItem(null)}>
        <DialogTitle>QR Scan Result</DialogTitle>
        <DialogContent>
          {scannedItem && scannedItem.notFound ? (
            <Alert severity="error">No item found with SKU: {scannedItem.sku}</Alert>
          ) : scannedItem ? (
            <Box>
              <Typography>Name: {scannedItem.name}</Typography>
              <Typography>SKU: {scannedItem.sku}</Typography>
              <Typography>Quantity: {scannedItem.quantity}</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="success" onClick={() => handleStockChange(scannedItem, 1)} disabled={loading}>
                  <Tooltip title="Stock In (+1)">
                    Stock In (+1)
                  </Tooltip>
                </Button>
                <Button variant="contained" color="error" onClick={() => handleStockChange(scannedItem, -1)} disabled={loading}>
                  <Tooltip title="Stock Out (-1)">
                    Stock Out (-1)
                  </Tooltip>
                </Button>
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScannedItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>
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