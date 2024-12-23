import React from 'react';
import { Link , useLocation} from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, Typography, Box} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Sidebar = () => {
    const location = useLocation();
  const menuItems = [
    { text: 'Events', icon: <EventIcon />, path: '/' },
    { text: 'Attendees', icon: <GroupIcon />, path: '/attendees' },
    { text: 'Tasks', icon: <AssignmentIcon />, path: '/tasks' },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#283593', 
          color: '#fff',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 80,
          backgroundColor: '#3949ab', 
          color: '#fff',
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.text}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem
              button
              sx={{
                backgroundColor: location.pathname === item.path ? '#5c6bc0' : 'inherit',
                '&:hover': { backgroundColor: '#3f51b5' }, // Hover effect color
                color: location.pathname === item.path ? '#fff' : '#c5cae9',
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#fff' : '#c5cae9',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
