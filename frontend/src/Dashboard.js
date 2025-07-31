import React, { useEffect, useState } from 'react';
import { Grid, Card, Box, Typography, Avatar, Paper, Alert, CircularProgress } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Layout from './Layout';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export default function Dashboard() {
  // Dashboard state
  const [metrics, setMetrics] = useState({ total_items: 0, low_stock: 0 });
  const [inventoryData, setInventoryData] = useState([]); // For bar chart
  const [orderStatusData, setOrderStatusData] = useState([]); // For pie chart
  const [suppliersCount, setSuppliersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        // Fetch inventory metrics
        const metricsRes = await fetch(`${API_URL}/api/inventory/metrics/`, { headers });
        if (metricsRes.ok) {
          const data = await metricsRes.json();
          setMetrics(data);
        }
        // Fetch inventory items for bar chart
        const invRes = await fetch(`${API_URL}/api/inventory/items/`, { headers });
        if (invRes.ok) {
          const invData = await invRes.json();
          setInventoryData(invData.map(i => ({ name: i.name, quantity: i.quantity })));
        }
        // Fetch order status analytics for pie chart
        const ordRes = await fetch(`${API_URL}/api/orders/analytics/`, { headers });
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (ordData.status_distribution) {
            setOrderStatusData(ordData.status_distribution.map(s => ({ name: s.status, value: s.count })));
          }
        }
        // Fetch supplier analytics
        const supRes = await fetch(`${API_URL}/api/suppliers/analytics/`, { headers });
        if (supRes.ok) {
          const supData = await supRes.json();
          setSuppliersCount(supData.total_suppliers || 0);
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Enhanced metrics cards (now using real data)
  const metricsCards = [
    { label: 'Inventory Items', value: metrics.total_items, icon: <InventoryIcon />, color: 'primary.main', bg: 'primary.light' },
    { label: 'Low Stock', value: metrics.low_stock, icon: <AssignmentIcon />, color: 'warning.dark', bg: 'warning.light' },
    { label: 'Pending Orders', value: orderStatusData.find(s => s.name === 'Pending')?.value || 0, icon: <AssignmentIcon />, color: 'secondary.dark', bg: 'secondary.light' },
    { label: 'Suppliers', value: suppliersCount, icon: <PeopleIcon />, color: 'success.dark', bg: 'success.light' },
  ];
  const pieColors = ['#1976d2', '#43a047', '#f5a623', '#d32f2f', '#6d4caf'];

  return (
    <Layout>
      {error && <Box sx={{ my: 2 }}><Alert severity="error">{error}</Alert></Box>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Metrics */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {metricsCards.map((metric) => (
              <Grid item xs={12} sm={6} md={3} key={metric.label}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 3, bgcolor: metric.bg, boxShadow: 3, borderRadius: 3, minWidth: 180 }}>
                  <Avatar sx={{ bgcolor: metric.color, color: '#fff', width: 48, height: 48 }}>{metric.icon}</Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h5" fontWeight={700}>{metric.value}</Typography>
                    <Typography color="text.secondary" fontWeight={600} variant="subtitle2">{metric.label}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* Charts and Reports */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2, mb: { xs: 3, md: 0 } }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Inventory Quantities</Typography>
                <Box sx={{ height: 260 }}>
                  {inventoryData.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ pt: 8 }}>
                      No inventory data to display.
                    </Typography>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inventoryData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="quantity" fill="#1976d2" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Order Status Distribution</Typography>
                <Box sx={{ height: 260 }}>
                  {orderStatusData.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ pt: 8 }}>
                      No order status data to display.
                    </Typography>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Layout>
  );
} 