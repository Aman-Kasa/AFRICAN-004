import React, { useState } from 'react';
import { 
  Box, Typography, Button, CircularProgress, Alert, Paper, Stack, Grid, Card, CardContent, 
  CardActions, Divider, Chip, IconButton, Tooltip, useMediaQuery 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0'];

/**
 * ReportsPage component
 * Enhanced UI for downloading inventory, order, and supplier reports as CSV or PDF files.
 */
export default function ReportsPage() {
  const [loading, setLoading] = useState(''); // '' | 'inventory' | 'orders' | 'suppliers'
  const [error, setError] = useState('');
  const [orderAnalytics, setOrderAnalytics] = useState(null);
  const [supplierAnalytics, setSupplierAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(''); // '' | 'inventory' | 'orders' | 'suppliers'

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Download a report from the backend API.
   * @param {'inventory'|'orders'|'suppliers'} type
   */
  const handleDownload = async (type) => {
    setLoading(type);
    setError('');
    let url = '';
    let filename = '';
    if (type === 'inventory') {
      url = `${API_URL}/api/inventory/items/export/csv/`;
      filename = 'inventory_export.csv';
    } else if (type === 'orders') {
      url = `${API_URL}/api/orders/export/csv/`;
      filename = 'orders_export.csv';
    } else if (type === 'suppliers') {
      url = `${API_URL}/api/suppliers/export/csv/`;
      filename = 'suppliers_export.csv';
    }
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError('Failed to download report.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading('');
    }
  };

  // Download a PDF report from the backend API.
  const handleDownloadPDF = async (type) => {
    setPdfLoading(type);
    setError('');
    let url = '';
    let filename = '';
    if (type === 'inventory') {
      url = `${API_URL}/api/inventory/items/export/pdf/`;
      filename = 'inventory_report.pdf';
    } else if (type === 'orders') {
      url = `${API_URL}/api/orders/export/pdf/`;
      filename = 'orders_report.pdf';
    } else if (type === 'suppliers') {
      url = `${API_URL}/api/suppliers/export/pdf/`;
      filename = 'suppliers_report.pdf';
    }
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError('Failed to download PDF report.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setPdfLoading('');
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError('');
      try {
        const token = localStorage.getItem('accessToken');
        const [orderRes, supplierRes] = await Promise.all([
          fetch(`${API_URL}/api/orders/analytics/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/suppliers/analytics/`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (!orderRes.ok || !supplierRes.ok) throw new Error('Failed to fetch analytics.');
        const orderData = await orderRes.json();
        const supplierData = await supplierRes.json();
        setOrderAnalytics(orderData);
        setSupplierAnalytics(supplierData);
      } catch {
        setAnalyticsError('Failed to fetch analytics.');
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
    // eslint-disable-next-line
  }, []);

  const reportTypes = [
    {
      title: 'Inventory Report',
      description: 'Complete inventory items list with quantities, SKUs, and stock levels',
      icon: <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      type: 'inventory',
      color: 'primary'
    },
    {
      title: 'Orders Report',
      description: 'Purchase orders with status, suppliers, and approval information',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      type: 'orders',
      color: 'secondary'
    },
    {
      title: 'Suppliers Report',
      description: 'Supplier directory with contact details and performance metrics',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      type: 'suppliers',
      color: 'success'
    }
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Header Section */}
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 4 }, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssessmentIcon sx={{ fontSize: 48, mr: 2 }} />
          <Box>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: 1 }}>
              Reports & Analytics
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Generate comprehensive reports for data analysis and record keeping
            </Typography>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Reports Section */}
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: 'primary.main' }}>
        📊 Available Reports
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {reportTypes.map((report) => (
          <Grid item xs={12} md={4} key={report.type}>
            <Card 
              elevation={4} 
              sx={{ 
                height: '100%', 
                borderRadius: 3, 
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: 8,
                  '& .download-buttons': { opacity: 1 }
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {report.icon}
                </Box>
                <Typography variant="h5" fontWeight={700} gutterBottom color={`${report.color}.main`}>
                  {report.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {report.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack direction="row" spacing={2} justifyContent="center" className="download-buttons">
                  <Tooltip title="Download CSV">
                    <IconButton
                      color="primary"
                      onClick={() => handleDownload(report.type)}
                      disabled={loading === report.type}
                      sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.main' }
                      }}
                    >
                      {loading === report.type ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Download PDF">
                    <IconButton
                      color="secondary"
                      onClick={() => handleDownloadPDF(report.type)}
                      disabled={pdfLoading === report.type}
                      sx={{ 
                        bgcolor: 'secondary.light', 
                        color: 'white',
                        '&:hover': { bgcolor: 'secondary.main' }
                      }}
                    >
                      {pdfLoading === report.type ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfIcon />}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Section */}
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <AssessmentIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight={700} color="primary.main">
            📈 Analytics Dashboard
          </Typography>
        </Box>
        
        {analyticsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={60} />
          </Box>
        ) : analyticsError ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>{analyticsError}</Alert>
        ) : (
          <Grid container spacing={4}>
            {/* Order Status Pie Chart */}
            <Grid item xs={12} lg={6}>
              <Card elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
                  📊 Order Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderAnalytics?.status_distribution || []}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {(orderAnalytics?.status_distribution || []).map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            
            {/* Top Suppliers Bar Chart */}
            <Grid item xs={12} lg={6}>
              <Card elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'success.main', mb: 3 }}>
                  🏆 Top Suppliers by Order Count
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={supplierAnalytics?.top_suppliers || []}>
                    <XAxis dataKey="supplier__name" />
                    <YAxis allowDecimals={false} />
                    <Bar dataKey="order_count" fill="#00C49F" radius={[4, 4, 0, 0]} />
                    <RechartsTooltip />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Quick Tips */}
      <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          💡 Quick Tips
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          • CSV files are perfect for data analysis in Excel or Google Sheets<br/>
          • PDF reports are ideal for sharing with stakeholders or for record keeping<br/>
          • Analytics charts provide real-time insights into your business performance
        </Typography>
      </Paper>
    </Box>
  );
} 