'use client'

import { Button, ButtonGroup, Snackbar, Stack, Typography, useTheme } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { useRouter } from 'next/navigation'

export function Connect() {
  const [open, setOpen] = useState(false);

  const { connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (isConnected) {
      router.push('/')
    }
  }, [isConnected]);

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => setOpen(false)}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 4 }}>
      {isConnected ? (
        <Button variant="outlined" color='warning' onClick={() => disconnect()}>
          Disconnect from {connector?.name}
        </Button>
      ) :
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Typography variant="h5" gutterBottom>
            Please connect using your favorite wallet
          </Typography>
          <ButtonGroup variant="outlined" aria-label="outlined primary button group">
            {connectors
              .filter((x) => x.ready && x.id !== connector?.id)
              .map((x) => (
                <Button key={x.id} onClick={() => connect({ connector: x })}>
                  {x.name}
                  {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
                </Button>
              ))}
          </ButtonGroup>
        </Stack>
      }
      <Snackbar
        open={open}
        autoHideDuration={6000}
        message={error?.message || 'Something went wrong'}
        onClose={() => setOpen(false)}
        action={action}
      />
    </Stack>
  )
}
