import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CalendarToday,
  MedicalServices,
  VideoCall,
  Person,
  AccessTime,
  LocalHospital
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentAPI, medicalRecordsAPI } from '../../services/api';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadPatientData();
    }
  }, [user]);

  const loadPatientData = async () => {
    try {
      setLoading(true);

      // Load upcoming appointments
      const appointmentsResponse = await appointmentAPI.getPatientAppointments(user.id);
      if (appointmentsResponse.data) {
        const upcoming = appointmentsResponse.data
          .filter(apt => new Date(apt.appointmentDateTime) > new Date())
          .slice(0, 3);
        setUpcomingAppointments(upcoming);
      }

      // Load recent medical records
      const recordsResponse = await medicalRecordsAPI.getPatientRecords(user.id);
      if (recordsResponse.data) {
        setRecentRecords(recordsResponse.data.slice(0, 3));
      }
    } catch (err) {
      setError('Failed to load patient data');
      console.error('Error loading patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
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
          Patient Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Welcome, {user?.firstName}!</Typography>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Upcoming Appointments
              </Typography>
              <Typography variant="h4">{upcomingAppointments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Medical Records
              </Typography>
              <Typography variant="h4">{recentRecords.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Prescriptions
              </Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Health Score
              </Typography>
              <Typography variant="h6" color="success.main">
                85%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Appointments</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => handleNavigation('/patient/appointments')}
              >
                Book Appointment
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleNavigation('/patient/appointments')}
              >
                View My Appointments
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MedicalServices color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Medical Records</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => handleNavigation('/patient/records')}
              >
                View Health Records
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleNavigation('/patient/records')}
              >
                Download Reports
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1 }} />
              Upcoming Appointments
            </Typography>
            {upcomingAppointments.length === 0 ? (
              <Typography color="text.secondary">No upcoming appointments</Typography>
            ) : (
              <List>
                {upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemText
                      primary={`Dr. ${appointment.doctor?.user?.lastName || 'Unknown'}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {formatDateTime(appointment.appointmentDateTime)}
                          </Typography>
                          <Chip
                            label={appointment.type || 'CONSULTATION'}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Recent Medical Records */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospital sx={{ mr: 1 }} />
              Recent Medical Records
            </Typography>
            {recentRecords.length === 0 ? (
              <Typography color="text.secondary">No medical records found</Typography>
            ) : (
              <List>
                {recentRecords.map((record) => (
                  <ListItem key={record.id} divider>
                    <ListItemText
                      primary={record.diagnosis || 'No diagnosis'}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {new Date(record.recordDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Dr. {record.doctor?.user?.lastName || 'Unknown'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;