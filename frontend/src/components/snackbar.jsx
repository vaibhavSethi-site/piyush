import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  


  export default function CustomSnackbar({ open, message, onClose }) {
    return (
      <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity="success">
                {message}
        </Alert>
      </Snackbar>
    );
  }