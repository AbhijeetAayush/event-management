import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import EventManagement from './components/EventManagement';
import AttendeeManagement from './components/AttendeeManagement';
import TaskTracker from './components/TaskTracker';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<EventManagement />} />
            <Route path="/attendees" element={<AttendeeManagement />} />
            <Route path="/tasks" element={<TaskTracker />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
