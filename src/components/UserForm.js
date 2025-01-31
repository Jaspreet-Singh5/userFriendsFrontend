import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Container, Snackbar, Alert } from '@mui/material';

/**
 * UserForm Component
 *
 * This component renders a form to add or edit a user.
 *
 * @param {Object} props - Component properties
 * @param {Object} [props.user] - User object containing existing user data (optional)
 * @param {Function} props.onSave - Callback function to be called after successfully saving the user data
 */
const UserForm = ({ user, onSave }) => {
  // State variables for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Effect to set form fields when the user prop changes
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    } else {
      setUsername('');
      setEmail('');
    }
  }, [user]);

  /**
   * Handle form submission
   *
   * @param {Event} event - Form submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = { username, email };

    if (user) {
      // Update existing user
      axios.put(`http://localhost/api/users/${user.id}/`, userData)
        .then(response => {
          onSave();
        })
        .catch(error => {
          console.error('There was an error updating the user!', error);
          setSnackbarMessage('Error updating user');
          setSnackbarOpen(true);
        });
    } else {
      // Create new user
      axios.post('http://localhost/api/users/', userData)
        .then(response => {
          onSave();
        })
        .catch(error => {
          console.error('There was an error creating the user!', error);
          setSnackbarMessage('Error creating user');
          setSnackbarOpen(true);
        });
    }
  };

  // Handle reset button click
  const handleReset = () => {
    setUsername('');
    setEmail('');
  };

  // Handle snackbar close event
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {user ? 'Edit User' : 'Add User'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1, mb: 2 }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserForm;
