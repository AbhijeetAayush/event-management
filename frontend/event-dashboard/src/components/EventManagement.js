// EventManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import Calendar from 'react-calendar';
import DeleteIcon from '@mui/icons-material/Delete';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateTime: '',
    organizer: '',
    slots: '',
    location: '',
  });
  const [highlightDates, setHighlightDates] = useState([]);

  // Fetch events from the backend
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/events') // Make sure your backend API URL is correct
      .then((response) => {
        setEvents(response.data);
        const dates = response.data.map(
          (event) => new Date(event.dateTime).toISOString().split('T')[0]
        );
        setHighlightDates(dates);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleAddEvent = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData({ name: '', dateTime: '', organizer: '', slots: '', location: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    axios
      .post('http://localhost:8080/api/events', formData) // API URL for adding event
      .then((response) => {
        setEvents([...events, response.data]);
        const eventDate = new Date(response.data.dateTime).toISOString().split('T')[0];
        setHighlightDates([...highlightDates, eventDate]);
        handleCloseForm();
      })
      .catch((error) => console.error('Error creating event:', error));
  };

  const deleteEvent = (id) => {
    axios
      .delete(`http://localhost:8080/api/events/${id}`) // API URL for deleting event
      .then(() => {
        const updatedEvents = events.filter((event) => event.id !== id);
        setEvents(updatedEvents);
        const remainingDates = updatedEvents.map((event) =>
          new Date(event.dateTime).toISOString().split('T')[0]
        );
        setHighlightDates(remainingDates);
      })
      .catch((error) => console.error('Error deleting event:', error));
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (highlightDates.includes(dateStr)) {
        return 'highlight';
      }
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Event Management
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddEvent}>
          Add Event
        </Button>
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {events.map((event) => (
            <Box key={event.id} sx={{ '&:hover': { transform: 'scale(1.05)', transition: '0.3s', backgroundColor: '#42a5f5', color: '#fff' } }}>
              <Card sx={{ minWidth: 275, backgroundColor: '#9fa8da' }}>
                <CardContent>
                  <Typography variant="h5">{event.name}</Typography>
                  <Typography color="text.secondary">Date & Time: {event.dateTime}</Typography>
                  <Typography color="text.secondary">Organizer: {event.organizer}</Typography>
                  <Typography color="text.secondary">Slots: {event.slots}</Typography>
                  <Typography color="text.secondary">Location: {event.location}</Typography>
                </CardContent>
                <IconButton onClick={() => deleteEvent(event.id)} color="error" aria-label="delete" sx={{ margin: '0 16px' }}>
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Box>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>Calendar</Typography>
        <Calendar tileClassName={tileClassName} />
      </div>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Event Name" name="name" value={formData.name} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Date & Time" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Organizer Name" name="organizer" value={formData.organizer} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Number of Slots" name="slots" type="number" value={formData.slots} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventManagement;
