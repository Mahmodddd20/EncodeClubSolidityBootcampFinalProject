import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useAccount, useDisconnect } from 'wagmi'
import { useRouter, usePathname } from 'next/navigation'

export default function ButtonAppBar() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, textTransform: 'uppercase' }}>
            Piggy Bank
          </Typography>
          {pathname !== '/connect' &&
            <Button color="inherit" onClick={() => isConnected ? disconnect() : router.push('/connect')}>
              {isConnected ? 'Disconnect' : 'Connect your wallet'}
            </Button>}

        </Toolbar>
      </AppBar>
    </Box>
  );
}