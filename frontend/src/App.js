import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import InventoryPage from './InventoryPage';
import OrdersPage from './OrdersPage';
import SuppliersPage from './SuppliersPage';
import ReportsPage from './ReportsPage';
import NotificationsPanel from './NotificationsPanel';
import AuditLogsPage from './AuditLogsPage';
import UserManagementPage from './UserManagementPage';
import PaymentsPage from './PaymentsPage';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import AboutPage from './AboutPage';
import Layout from './Layout';

// Placeholder components
function Landing() {
  const [showTitle, setShowTitle] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setShowTitle(true), 200); // slight delay for effect
  }, []);
  return (
    <Box maxWidth="md" sx={{ py: 8, mx: 'auto' }}>
      {/* Illustration/Icon above the title */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Inventory2OutlinedIcon sx={{ fontSize: 80, color: 'primary.main' }} />
      </Box>
      <Fade in={showTitle} timeout={900}>
        <div>
          <Slide in={showTitle} direction="up" timeout={900}>
            <div>
              <Box component="h1" sx={{ fontSize: { xs: 32, sm: 48 }, fontWeight: 800, textAlign: 'center', mb: 2 }}>
                Inventory and Procurement Management System
              </Box>
            </div>
          </Slide>
        </div>
      </Fade>
      <Box sx={{ fontSize: 22, textAlign: 'center', color: 'text.secondary', mb: 4 }}>
        Empowering African industries with modern, efficient, and transparent inventory and procurement solutions.
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 700, fontSize: 24, px: 5, py: 1.5, borderRadius: 3, boxShadow: 3 }}
          >
            Login
          </Button>
        </Link>
        <Link to="/about" style={{ textDecoration: 'none' }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{ fontWeight: 700, fontSize: 20, px: 4, py: 1.5, borderRadius: 3, ml: 2 }}
          >
            About
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

function Login() {
  return <LoginForm />;
}

// Utility to check if user is authenticated (JWT exists)
function isAuthenticated() {
  return !!localStorage.getItem('accessToken');
}

function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Enterprise color palette
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#183153', // Deep blue
    },
    secondary: {
      main: '#F5A623', // Gold accent
    },
    background: {
      default: '#f4f6f8', // Light gray
      paper: '#fff',
    },
    text: {
      primary: '#183153',
      secondary: '#5c6c7b',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected routes with sidebar layout */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Layout><InventoryPage /></Layout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><Layout><SuppliersPage /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationsPanel /></Layout></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute><Layout><AuditLogsPage /></Layout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Layout><UserManagementPage /></Layout></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Layout><PaymentsPage /></Layout></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
