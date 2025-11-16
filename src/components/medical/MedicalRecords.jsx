import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore,
  LocalHospital,
  CalendarToday,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for testing
const mockMedicalRecords = [
  {
    id: 1,
    diagnosis: 'Hypertension',
    recordDate: '2024-01-15',
    doctor: {
      firstName: 'John',
      lastName: 'Smith'
    },
    symptoms: 'High blood pressure, headaches',
    treatment: 'Prescribed medication and lifestyle changes',
    medications: 'Lisinopril 10mg daily',
    bloodPressureSystolic: 140,
    bloodPressureDiastolic: 90,
    temperature: 36.8,
    weight: 75,
    height: 175
  },
  {
    id: 2,
    diagnosis: 'Common Cold',
    recordDate: '2024-01-10',
    doctor: {
      firstName: 'Sarah',
      lastName: 'Johnson'
    },
    symptoms: 'Runny nose, cough, mild fever',
    treatment: 'Rest and hydration',
    medications: 'Over-the-counter cold medicine',
    temperature: 37.5
  }
];

const MedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadMedicalRecords();
    }
  }, [user]);

  const loadMedicalRecords = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecords(mockMedicalRecords);
    } catch (err) {
      console.error('Error loading medical records:', err);
      setError('Failed to load medical records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getVitalSigns = (record) => {
    if (!record) return '';

    const vitals = [];
    if (record.bloodPressureSystolic && record.bloodPressureDiastolic) {
      vitals.push(`BP: ${record.bloodPressureSystolic}/${record.bloodPressureDiastolic}`);
    }
    if (record.temperature) {
      vitals.push(`Temp: ${record.temperature}°C`);
    }
    if (record.height && record.weight) {
      const bmi = (record.weight / ((record.height / 100) ** 2)).toFixed(1);
      vitals.push(`BMI: ${bmi}`);
    }
    return vitals.join(' • ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getDoctorName = (record) => {
    if (!record) return 'Unknown Doctor';

    if (record.doctor?.firstName && record.doctor?.lastName) {
      return `Dr. ${record.doctor.firstName} ${record.doctor.lastName}`;
    } else {
      return 'Unknown Doctor';
    }
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
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospital sx={{ mr: 2 }} />
          Medical Records
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {records.length === 0 ? (
          <Alert severity="info">
            No medical records found. Your medical history will appear here after your first appointment.
          </Alert>
        ) : (
          <List>
            {records.map((record) => (
              <Accordion key={record.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {record.diagnosis}
                      </Typography>
                      <Chip
                        label={formatDate(record.recordDate)}
                        size="small"
                        icon={<CalendarToday />}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Person sx={{ mr: 0.5, fontSize: 16 }} />
                      {getDoctorName(record)}
                    </Typography>
                    {getVitalSigns(record) && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {getVitalSigns(record)}
                      </Typography>
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ pl: 2 }}>
                    {record.symptoms && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Symptoms:
                        </Typography>
                        <Typography variant="body1">{record.symptoms}</Typography>
                      </Box>
                    )}

                    {record.treatment && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Treatment:
                        </Typography>
                        <Typography variant="body1">{record.treatment}</Typography>
                      </Box>
                    )}

                    {record.medications && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Medications:
                        </Typography>
                        <Typography variant="body1">{record.medications}</Typography>
                      </Box>
                    )}

                    {record.labResults && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Lab Results:
                        </Typography>
                        <Typography variant="body1">{record.labResults}</Typography>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default MedicalRecords;