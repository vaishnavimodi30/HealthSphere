import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { CalendarToday, AccessTime, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentAPI, doctorAPI } from '../../services/api';

const AppointmentScheduler = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const loadDoctors = async () => {
    try {
      setDoctorsLoading(true);
      const response = await doctorAPI.getAll();

      // Handle different response structures
      let doctorsData = [];

      if (Array.isArray(response.data)) {
        // If response.data is directly an array
        doctorsData = response.data;
      } else if (response.data && Array.isArray(response.data.doctors)) {
        // If response.data has a doctors array property
        doctorsData = response.data.doctors;
      } else if (response.data && Array.isArray(response.data.content)) {
        // If using pagination with content property
        doctorsData = response.data.content;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // If using success/data pattern
        doctorsData = response.data.data;
      }

      console.log('Doctors data:', doctorsData); // Debug log
      setDoctors(doctorsData || []);

    } catch (err) {
      console.error('Error loading doctors:', err);
      setError('Failed to load doctors');
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAvailableSlots(selectedDoctor, selectedDate);

      let slotsData = [];

      if (Array.isArray(response.data)) {
        slotsData = response.data;
      } else if (response.data && Array.isArray(response.data.availableSlots)) {
        slotsData = response.data.availableSlots;
      } else if (response.data && Array.isArray(response.data.slots)) {
        slotsData = response.data.slots;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        slotsData = response.data.data;
      }

      console.log('Available slots:', slotsData); // Debug log
      setAvailableSlots(slotsData || []);
    } catch (err) {
      console.error('Error loading available slots:', err);
      setError('Failed to load available slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot || !reason) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const appointmentData = {
        doctorId: parseInt(selectedDoctor),
        patientId: user.id,
        appointmentDateTime: `${selectedDate}T${selectedSlot}:00`,
        type: 'CONSULTATION',
        reason: reason,
        status: 'SCHEDULED'
      };

      console.log('Scheduling appointment:', appointmentData);

      const response = await appointmentAPI.schedule(appointmentData);

      if (response.data) {
        setSuccess('Appointment scheduled successfully!');
        // Reset form
        setSelectedDoctor('');
        setSelectedDate('');
        setSelectedSlot('');
        setReason('');
        setAvailableSlots([]);
      } else {
        throw new Error('No response data received');
      }
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      setError(err.response?.data?.message || 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 2 }} />
          Schedule Appointment
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appointment Details
                </Typography>

                <TextField
                  select
                  fullWidth
                  label="Select Doctor"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  margin="normal"
                  disabled={doctorsLoading}
                  helperText={doctorsLoading ? "Loading doctors..." : "Choose a doctor"}
                >
                  {doctorsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading doctors...
                    </MenuItem>
                  ) : doctors.length === 0 ? (
                    <MenuItem disabled>
                      No doctors available
                    </MenuItem>
                  ) : (
                    doctors.map((doctor) => (
                      <MenuItem key={doctor.userId || doctor.id} value={doctor.userId || doctor.id}>
                        Dr. {doctor.user?.firstName || doctor.firstName} {doctor.user?.lastName || doctor.lastName}
                        {doctor.specialization && ` - ${doctor.specialization}`}
                      </MenuItem>
                    ))
                  )}
                </TextField>

                <TextField
                  fullWidth
                  type="date"
                  label="Appointment Date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: getMinDate(),
                    max: getMaxDate()
                  }}
                  disabled={!selectedDoctor}
                  helperText={!selectedDoctor ? "Select a doctor first" : "Choose appointment date"}
                />

                <TextField
                  fullWidth
                  label="Reason for Visit"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Please describe your symptoms or reason for appointment..."
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 1 }} />
                  Available Time Slots
                </Typography>

                {!selectedDoctor || !selectedDate ? (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
                    Please select a doctor and date to see available time slots
                  </Typography>
                ) : loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : availableSlots.length === 0 ? (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
                    No available slots for the selected date
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availableSlots.map((slot, index) => (
                      <Button
                        key={slot || index}
                        variant={selectedSlot === slot ? "contained" : "outlined"}
                        onClick={() => setSelectedSlot(slot)}
                        sx={{ minWidth: '100px' }}
                      >
                        {slot}
                      </Button>
                    ))}
                  </Box>
                )}

                {selectedSlot && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="body1" color="white">
                      Selected: {selectedDate} at {selectedSlot}
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleScheduleAppointment}
                  disabled={loading || !selectedSlot}
                  sx={{ mt: 3 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Schedule Appointment'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AppointmentScheduler;