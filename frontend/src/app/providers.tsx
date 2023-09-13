'use client'

import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ButtonAppBar from '../components/AppBar'

import { config } from '../wagmi'
const theme = createTheme({
  palette: {
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  return <WagmiConfig config={config}>
    <ThemeProvider theme={theme}>
      <ButtonAppBar />
      {mounted && children}
    </ThemeProvider>
  </WagmiConfig>
}
