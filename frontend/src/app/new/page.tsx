"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Stack, Typography } from '@mui/material';

export default function FormPropsTextFields() {
  return (
    <Box
      component="form"
      sx={{
        mt: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Typography variant="h5">New Sub-Piggy Bank</Typography>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <TextField
            required
            id="name"
            label="Name"
            defaultValue="Name"
            helperText="Can't be changed"
            variant="standard"
          />
          <TextField
            required
            id="time"
            label="Time"
            defaultValue="Time"
            helperText="Can't be changed"
            variant="standard"
          />
        </Stack>
        <Button variant='contained' color='success'>Create</Button>
      </Stack>
    </Box>
  );
}