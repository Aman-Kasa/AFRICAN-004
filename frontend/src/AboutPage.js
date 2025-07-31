import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Stack, useTheme } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AboutPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showHero, setShowHero] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setShowHero(true), 200);
  }, []);
  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'radial-gradient(circle at 60% 10%, #f5f7fa 0%, #e3eafc 40%, #f0e6ff 100%)',
      backgroundAttachment: 'fixed',
      position: 'relative',
    }}>
      {/* Top navigation buttons */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 0 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/login"
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            Login
          </Button>
        </Stack>
      </Container>
      {/* Hero/Mission Section */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 10, sm: 14 },
          px: 2,
          position: 'relative',
          color: '#fff',
          borderBottomLeftRadius: { xs: 40, sm: 80 },
          borderBottomRightRadius: { xs: 40, sm: 80 },
          mb: 0,
          overflow: 'hidden',
          background: 'linear-gradient(120deg, #183153cc 60%, #F5A623cc 100%)',
        }}
      >
        {/* Hero background image with overlay */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: `url('https://blog.lio.io/wp-content/uploads/2023/05/Procurement-and-Inventory-Management.jpg') center/cover no-repeat`,
          opacity: 0.25,
          filter: 'blur(2px) saturate(1.2)',
        }} />
        {/* Decorative shapes */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 180,
          height: 180,
          bgcolor: 'primary.main',
          opacity: 0.12,
          borderBottomRightRadius: 180,
          zIndex: 1,
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 120,
          height: 120,
          bgcolor: 'secondary.main',
          opacity: 0.13,
          borderTopLeftRadius: 120,
          zIndex: 1,
        }} />
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4, position: 'relative', zIndex: 2 }}>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Fade in={showHero} timeout={900}>
              <div>
                <Slide in={showHero} direction="up" timeout={900}>
                  <div>
                    <Typography
                      variant="h2"
                      fontWeight={900}
                      gutterBottom
                      sx={{
                        letterSpacing: 2,
                        textShadow: '0 4px 24px #7b1fa2aa',
                        color: 'primary.dark',
                        background: 'linear-gradient(90deg, #183153 60%, #F5A623 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Empowering African Industries
                    </Typography>
                  </div>
                </Slide>
              </div>
            </Fade>
            <Fade in={showHero} timeout={1400}>
              <Typography
                variant="h5"
                fontWeight={500}
                sx={{
                  opacity: 0.97,
                  textShadow: '0 2px 8px #7b1fa255',
                  mb: 2,
                  color: '#3d3d5c',
                }}
              >
                Our mission is to deliver modern, efficient, and transparent inventory and procurement solutions for organizations of all sizes across Africa.
              </Typography>
            </Fade>
            <Fade in={showHero} timeout={1800}>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.93,
                  fontSize: 18,
                  color: '#4e4e6e',
                  textShadow: '0 1px 4px #f5a62322',
                }}
              >
                We believe in a future where every African business has the tools to thrive, grow, and make a difference in their communities.
              </Typography>
            </Fade>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Box sx={{
              width: 340,
              height: 240,
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: theme.shadows[6],
              border: '4px solid #fff',
              background: '#fff',
              position: 'relative',
            }}>
              <img
                src="https://blog.lio.io/wp-content/uploads/2023/05/Procurement-and-Inventory-Management.jpg"
                alt="Procurement and Inventory Management"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
              {/* Overlay for extra style */}
              <Box sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(24,49,83,0.10)',
                borderRadius: 6,
              }} />
            </Box>
          </Box>
        </Container>
        {/* Wavy SVG divider */}
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: -1, zIndex: 1 }}>
          <svg viewBox="0 0 1440 80" width="100%" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f5f7fa" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </Box>
      </Box>
      {/* Mission & Vision Section */}
      <Container maxWidth="md" sx={{ mt: -6, mb: 6, position: 'relative', zIndex: 2 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, background: 'linear-gradient(120deg, #fff 60%, #e3eafc 100%)', boxShadow: '0 8px 32px #18315322', mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: 'secondary.dark',
              textShadow: '0 2px 8px #f5a62344',
            }}
            gutterBottom
            align="center"
          >
            Our Mission & Vision
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              fontSize: 18,
              mb: 2,
              color: '#5c6c7b',
            }}
          >
            We are committed to:
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Stack alignItems="center" spacing={1}>
                <TrendingUpOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography fontWeight={700}>
                  <span style={{ color: '#7b1fa2' }}>Driving Growth</span>
                </Typography>
                <Typography align="center" color="text.secondary">Helping African businesses scale and succeed with world-class tools.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack alignItems="center" spacing={1}>
                <EmojiObjectsOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography fontWeight={700}>
                  <span style={{ color: '#f5a623' }}>Innovation</span>
                </Typography>
                <Typography align="center" color="text.secondary">Embracing new technology to solve real-world problems.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack alignItems="center" spacing={1}>
                <PublicOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography fontWeight={700}>
                  <span style={{ color: '#183153' }}>Transparency</span>
                </Typography>
                <Typography align="center" color="text.secondary">Building trust through open, honest communication and clear processes.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack alignItems="center" spacing={1}>
                <Diversity3OutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography fontWeight={700}>
                  <span style={{ color: '#388e3c' }}>Community</span>
                </Typography>
                <Typography align="center" color="text.secondary">Supporting and uplifting African businesses and communities.</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6, position: 'relative', zIndex: 2 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'linear-gradient(120deg, #fff 60%, #e3eafc 100%)', boxShadow: '0 8px 32px #18315322' }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: 'primary.main',
              textShadow: '0 2px 8px #18315333',
            }}
            gutterBottom
            align="center"
          >
            Key Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Stack alignItems="center" spacing={1} sx={{ bgcolor: '#e3eafc', borderRadius: 3, p: 2, height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 4, bgcolor: '#d1e3fa' } }}>
                <Inventory2OutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#7b1fa2' }}>Inventory Management</Typography>
                <Typography align="center" color="text.secondary">Track, update, and manage inventory items with real-time visibility and low-stock alerts.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack alignItems="center" spacing={1} sx={{ bgcolor: '#f5f7fa', borderRadius: 3, p: 2, height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 4, bgcolor: '#e3eafc' } }}>
                <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#f5a623' }}>Order Processing</Typography>
                <Typography align="center" color="text.secondary">Create, approve, and monitor purchase orders with status tracking and analytics.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack alignItems="center" spacing={1} sx={{ bgcolor: '#e3eafc', borderRadius: 3, p: 2, height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 4, bgcolor: '#d1e3fa' } }}>
                <PeopleAltOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#388e3c' }}>Supplier Management</Typography>
                <Typography align="center" color="text.secondary">Maintain supplier records, evaluate performance, and streamline procurement relationships.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack alignItems="center" spacing={1} sx={{ bgcolor: '#f5f7fa', borderRadius: 3, p: 2, height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 4, bgcolor: '#e3eafc' } }}>
                <AssessmentOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#183153' }}>Reports & Analytics</Typography>
                <Typography align="center" color="text.secondary">Generate insightful reports and visualize key metrics for smarter business decisions.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack alignItems="center" spacing={1} sx={{ bgcolor: '#e3eafc', borderRadius: 3, p: 2, height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 4, bgcolor: '#d1e3fa' } }}>
                <NotificationsActiveOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#f5a623' }}>Notifications</Typography>
                <Typography align="center" color="text.secondary">Stay informed with real-time alerts for low stock, pending orders, and more.</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack alignItems="center" spacing={1} sx={{ bgcolor: '#f5f7fa', borderRadius: 3, p: 2, height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.04)', boxShadow: 4, bgcolor: '#e3eafc' } }}>
                <HistoryEduOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#7b1fa2' }}>Audit Logs</Typography>
                <Typography align="center" color="text.secondary">Track all system activities for transparency, compliance, and accountability.</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      {/* Testimonial/Quote Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'linear-gradient(90deg, #f5f7fa 60%, #e3eafc 100%)', boxShadow: '0 4px 24px #18315311', textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
            What Our Users Say
          </Typography>
          <Typography variant="h6" fontStyle="italic" color="text.secondary" sx={{ mb: 2 }}>
            “IPMS has transformed the way we manage our inventory and procurement. The analytics and notifications keep us ahead of the curve!”
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} color="primary.main">
            — Operations Manager, African Manufacturing Co.
          </Typography>
        </Paper>
      </Container>
      {/* Contact Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'linear-gradient(120deg, #e3eafc 60%, #fff 100%)' }}>
          <Typography variant="h4" fontWeight={800} color="primary.main" gutterBottom align="center">
            Contact Us
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2} mb={2} justifyContent="center">
            <ContactMailOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#7b1fa2' }}>a.kasa@alustudent.com</Typography>
          </Stack>
          <Typography color="text.secondary" align="center">For support, partnership, or demo requests, please contact us at the email above.</Typography>
        </Paper>
      </Container>
    </Box>
  );
} 