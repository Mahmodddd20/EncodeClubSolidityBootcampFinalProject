/* eslint-disable react/no-unescaped-entities */
"use client"

import { Button, Stack, Typography } from "@mui/material"
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { isConnected } = useAccount();
  const router = useRouter()

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={8}
      sx={{
        mt: 6,
        height: 'calc(100vh - 130px)',
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2018/05/15/08/44/save-3402476_1280.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',

      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          fontWeight: '600',
          lineHeight: '75px',
          fontSize: '28px',
        }}>
        Welcome to the future of finance! 🚀<br />
        Explore our Web3 Piggy Bank, where decentralized savings meet cutting-edge technology.<br />
        Start building your crypto nest egg today and experience a new era of financial freedom.<br />
        Secure, transparent, and easy – it's time to embrace the future with open arms.<br />
        Let's embark on this exciting journey together! 🐷💰🌐
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={() => isConnected ? router.push('/start') : router.push('/connect')}>
        Start Saving
      </Button>
    </Stack>
  )
}
