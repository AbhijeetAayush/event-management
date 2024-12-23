import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AttendeeManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendees, setAttendees] = useState({});
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
  });
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [error, setError] = useState('');

  // Fetch events from the backend on component mount
  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoadingEvents(false);
      })
      .catch((error) => {
        setError('Error fetching events');
        setLoadingEvents(false);
        console.error('Error fetching events:', error);
      });
  }, []);

  // Fetch attendees for the selected event
  useEffect(() => {
    if (selectedEvent) {
      setLoadingAttendees(true);
      fetch(`/api/attendees/event/${selectedEvent}`)
        .then((response) => response.json())
        .then((data) => {
          setAttendees((prev) => ({
            ...prev,
            [selectedEvent]: data,
          }));
          setLoadingAttendees(false);
        })
        .catch((error) => {
          setError('Error fetching attendees');
          setLoadingAttendees(false);
          console.error('Error fetching attendees:', error);
        });
    }
  }, [selectedEvent]);

  // Add a new attendee to the selected event
  const handleAddAttendee = () => {
    if (!selectedEvent) return alert('Please select an event');
    const { name, phone, age, gender } = newAttendee;
    if (name.trim() && phone.trim() && age.trim() && gender.trim()) {
      fetch(`/api/attendees/event/${selectedEvent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAttendee),
      })
        .then((response) => response.json())
        .then((data) => {
          setAttendees((prevAttendees) => ({
            ...prevAttendees,
            [selectedEvent]: [...(prevAttendees[selectedEvent] || []), data],
          }));
          setNewAttendee({ name: '', phone: '', age: '', gender: '' });
        })
        .catch((error) => {
          setError('Error adding attendee');
          console.error('Error adding attendee:', error);
        });
    }
  };

  // Remove an attendee by index from the selected event
  const handleRemoveAttendee = (index) => {
    if (!selectedEvent) return;
    const attendeeId = attendees[selectedEvent][index].id;
    fetch(`/api/attendees/${attendeeId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setAttendees((prevAttendees) => ({
          ...prevAttendees,
          [selectedEvent]: prevAttendees[selectedEvent].filter(
            (_, i) => i !== index
          ),
        }));
      })
      .catch((error) => {
        setError('Error removing attendee');
        console.error('Error removing attendee:', error);
      });
  };

  // Handle input change for attendee details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee({ ...newAttendee, [name]: value });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Attendee Management
      </Typography>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {/* Event Dropdown */}
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel id="event-select-label">Select Event</InputLabel>
        <Select
          labelId="event-select-label"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          label="Select Event"
        >
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.name} - {event.date} {/* Displaying more event details */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Attendee Input Form */}
      <Box sx={{ marginBottom: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newAttendee.name}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={newAttendee.phone}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={newAttendee.age}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={newAttendee.gender}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Box sx={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleAddAttendee}>
            Add Attendee
          </Button>
        </Box>
      </Box>

      {/* Attendee List for Selected Event */}
      <Typography variant="h5" gutterBottom>
        Attendee List for {selectedEvent ? events.find((e) => e.id === selectedEvent)?.name : 'No Event Selected'}
      </Typography>

      {loadingAttendees ? (
        <CircularProgress />
      ) : selectedEvent && attendees[selectedEvent]?.length > 0 ? (
        <List>
          {attendees[selectedEvent].map((attendee, index) => (
            <ListItem
              key={attendee.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#e0e7ff',
                borderRadius: '4px',
                marginBottom: '10px',
                '&:hover': {
                  backgroundColor: '#c7d2fe',
                  transform: 'scale(1.02)',
                  transition: '0.3s',
                },
              }}
            >
              <ListItemText
                primary={`Name: ${attendee.name}`}
                secondary={`Phone: ${attendee.phone}, Age: ${attendee.age}, Gender: ${attendee.gender}`}
              />
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleRemoveAttendee(index)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">No attendees added yet for this event.</Typography>
      )}
    </div>
  );
};

export default AttendeeManagement;
