'use client'

import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import { ThemeProvider } from '@mui/material/styles';
import ButtonAppBar from '../components/AppBar'

import { config } from '../wagmi'
import { appTheme } from '../assets/themes/app';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  return <WagmiConfig config={config}>
    <ThemeProvider theme={appTheme}>
      <ButtonAppBar />
      {mounted && children}
    </ThemeProvider>
  </WagmiConfig>
}
