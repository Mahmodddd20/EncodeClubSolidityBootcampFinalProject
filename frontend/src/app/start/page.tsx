"use client"
import { Button, Stack, Tab, Typography } from '@mui/material';
import SubPiggyBankTable from '../../components/SubPiggyBankTable';
import { useRouter } from 'next/navigation'


export default function Page() {
  const router = useRouter()

  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 4 }}>
        <Typography variant="h4">Sub-Piggy Bank Table</Typography>
        <Button variant='contained' color='primary'
          onClick={() => router.push('/new')}>
          Create New
        </Button>
      </Stack>
      <SubPiggyBankTable />
    </Stack>
  )
}
