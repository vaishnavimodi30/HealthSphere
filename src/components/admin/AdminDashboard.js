import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Box
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  Business,
  Analytics
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Welcome, {user?.firstName}!</Typography>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* System Overview */}
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">156</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Doctors
              </Typography>
              <Typography variant="h4">24</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Appointments
              </Typography>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                System Status
              </Typography>
              <Typography variant="h6" color="success.main">
                Online
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Management Sections */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">User Management</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mb: 1 }}>
                Manage Users
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                Doctor Approvals
              </Button>
              <Button variant="outlined" fullWidth>
                Patient Accounts
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">System Management</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mb: 1 }}>
                System Settings
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                Security & Compliance
              </Button>
              <Button variant="outlined" fullWidth>
                Audit Logs
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Analytics color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Reports & Analytics</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mb: 1 }}>
                View Reports
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                Usage Statistics
              </Button>
              <Button variant="outlined" fullWidth>
                HIPAA Compliance
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AdminPanelSettings color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Administration</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mb: 1 }}>
                Database Management
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                Backup & Recovery
              </Button>
              <Button variant="outlined" fullWidth>
                System Maintenance
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;