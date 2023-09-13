import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useAccount, useDisconnect } from 'wagmi'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '@mui/material/styles';
import SavingsIcon from '@mui/icons-material/Savings';

export default function ButtonAppBar() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme();
  const handleDisconnect = () => {
    disconnect();
    router.push('/')
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: theme.palette.secondaryOrange500 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <SavingsIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, textTransform: 'uppercase' }}>
            Piggy Bank
          </Typography>
          {pathname !== '/connect' &&
            <Button color="inherit" onClick={() => isConnected ? handleDisconnect() : router.push('/connect')}>
              {isConnected ? 'Disconnect' : 'Connect your wallet'}
            </Button>}

        </Toolbar>
      </AppBar>
    </Box >
  );
}