import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const TaskTracker = () => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Event 1', progress: 50 },
    { id: 2, name: 'Event 2', progress: 75 },
    { id: 3, name: 'Event 3', progress: 30 },
    { id: 4, name: 'Event 4', progress: 30 },
    { id: 5, name: 'Event 5', progress: 30 },
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newProgress, setNewProgress] = useState('');

  const updateProgress = () => {
    if (selectedEvent !== null) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? { ...event, progress: Number(newProgress) } : event
        )
      );
      setSelectedEvent(null);
      setNewProgress('');
    }
  };

  const data = events.map((event) => ({
    name: event.name,
    value: event.progress,
  }));

  const colors = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];

  const barData = events.map(event => ({
    name: event.name,
    progress: event.progress,
  }));

  const lineData = events.map(event => ({
    name: event.name,
    progress: event.progress,
  }));

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Task Tracker
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mt={4}>
        {events.map((event) => (
          <Card key={event.id} sx={{ padding: 2, backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6">{event.name}</Typography>
              <Typography variant="body2" gutterBottom>
                Progress: {event.progress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={event.progress}
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setSelectedEvent(event)}
              >
                Update Progress
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {selectedEvent && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Update Progress for {selectedEvent.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="New Progress (%)"
                type="number"
                value={newProgress}
                onChange={(e) => setNewProgress(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={updateProgress}
                fullWidth
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          Progress Overview
        </Typography>
        
        {/* Pie Chart */}
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#82ca9d"
            label={(entry) => `${entry.name}: ${entry.value}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        {/* Bar Chart */}
        <Typography variant="h6" gutterBottom mt={6}>
          Progress in Bar Chart
        </Typography>
        <BarChart
          width={400}
          height={300}
          data={barData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="progress" fill="#8884d8" />
        </BarChart>

        {/* Line Chart */}
        <Typography variant="h6" gutterBottom mt={6}>
          Progress Over Time
        </Typography>
        <LineChart
          width={400}
          height={300}
          data={lineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="progress" stroke="#82ca9d" />
        </LineChart>
      </Box>
    </div>
  );
};

export default TaskTracker;
