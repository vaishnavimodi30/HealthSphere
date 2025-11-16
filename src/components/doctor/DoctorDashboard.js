import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  People,
  Schedule,
  Assignment,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentAPI } from '../../services/api';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDoctorData();
    }
  }, [user]);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getDoctorAppointments(user.id);
      if (response.data) {
        const todayAppointments = response.data
          .filter(apt => {
            const aptDate = new Date(apt.appointmentDateTime);
            const today = new Date();
            return aptDate.toDateString() === today.toDateString();
          })
          .slice(0, 5);
        setUpcomingAppointments(todayAppointments);
      }
    } catch (err) {
      console.error('Error loading doctor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Doctor Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Welcome, Dr. {user?.lastName}!</Typography>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Today's Appointments
              </Typography>
              <Typography variant="h4">{upcomingAppointments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Patients This Week
              </Typography>
              <Typography variant="h4">23</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Records
              </Typography>
              <Typography variant="h4">8</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Video Consults
              </Typography>
              <Typography variant="h4">3</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Appointment Schedule</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mb: 1 }}>
                View Today's Schedule
              </Button>
              <Button variant="outlined" fullWidth>
                Manage Availability
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Patient Records</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mb: 1 }}>
                Access EHR System
              </Button>
              <Button variant="outlined" fullWidth>
                Write E-Prescription
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Appointments
            </Typography>
            {upcomingAppointments.length === 0 ? (
              <Typography color="text.secondary">No appointments for today</Typography>
            ) : (
              <List>
                {upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemText
                      primary={appointment.patient?.user?.firstName + ' ' + appointment.patient?.user?.lastName || 'Unknown Patient'}
                      secondary={`${new Date(appointment.appointmentDateTime).toLocaleTimeString()} - ${appointment.type || 'CONSULTATION'}`}
                    />
                    <Button variant="outlined" size="small">
                      View Details
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" fullWidth>
                Telemedicine Room
              </Button>
              <Button variant="outlined" fullWidth>
                Medical Records
              </Button>
              <Button variant="outlined" fullWidth>
                E-Prescribing
              </Button>
              <Button variant="outlined" fullWidth>
                Patient Portal
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard;