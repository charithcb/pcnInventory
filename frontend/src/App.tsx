import { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SecurityIcon from '@mui/icons-material/Security';
import LoginIcon from '@mui/icons-material/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b69a49',
      contrastText: '#1f1a10',
    },
    secondary: {
      main: '#4a4338',
    },
    background: {
      default: '#f5f0e4',
      paper: '#fffaf0',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    body1: {
      color: '#3f3425',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: '#e4d6b5',
          background: 'linear-gradient(180deg, #fffaf6 0%, #fff6e8 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 700,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
  },
});

function App() {
  const [authTab, setAuthTab] = useState(0);
  const [staffRole, setStaffRole] = useState<'STAFF' | 'ADMIN'>('STAFF');

  const highlights = useMemo(
    () => [
      {
        icon: <WorkspacePremiumIcon />,
        label: 'Regulated Fleet Ready',
        detail: 'Temperature control and compliance baked in for sensitive cargo.',
      },
      {
        icon: <Inventory2Icon />,
        label: 'Live Inventory Posture',
        detail: 'Track dispatch readiness, handoffs, and reservations in one view.',
      },
      {
        icon: <SecurityIcon />,
        label: 'Role-based Controls',
        detail: 'Separate staff and admin entrances with system credentials.',
      },
    ],
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: `radial-gradient(circle at 20% 20%, #f0e3c4 0%, transparent 30%),
            radial-gradient(circle at 80% 0%, #d4c08c 0%, transparent 25%),
            linear-gradient(180deg, #f8f2e7 0%, #f2eadb 100%)`,
          pb: 10,
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          color="transparent"
          sx={{ borderBottom: '1px solid #e6d7b2', background: 'rgba(255, 250, 240, 0.8)', backdropFilter: 'blur(6px)' }}
        >
          <Toolbar sx={{ maxWidth: 1160, mx: 'auto', width: '100%', px: 2 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                bgcolor: 'primary.main',
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.contrastText',
                fontWeight: 800,
                boxShadow: '0 10px 25px rgba(182, 154, 73, 0.35)',
              }}
            >
              PCN
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" color="secondary.main" fontWeight={800}>
                PCN Inventory Portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure entry for customers, staff, and administrators
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip label="Live" color="primary" variant="filled" size="small" />
              <Chip label="Service desk 24/7" variant="outlined" color="secondary" size="small" />
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ pt: 8 }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', border: '1px solid #e7d7ae' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Chip label="Trusted Logistics" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                    <Typography variant="h3" color="secondary.main">
                      Modernize inventory visibility and access controls
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Register customers with rich contact data, or sign in returning teams instantly. Staff and admin
                      routes are sealed behind system credentials for operational discipline.
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack spacing={2}>
                      {highlights.map((item) => (
                        <Stack
                          key={item.label}
                          direction="row"
                          spacing={2}
                          alignItems="flex-start"
                          sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(182,154,73,0.08)' }}
                        >
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: '50%',
                              bgcolor: 'rgba(75, 67, 56, 0.08)',
                              color: 'primary.main',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="secondary.main">
                              {item.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.detail}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Card sx={{ border: '1px solid #e7d7ae' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Tabs
                      value={authTab}
                      onChange={(_, value) => setAuthTab(value)}
                      textColor="primary"
                      indicatorColor="primary"
                      variant="fullWidth"
                      sx={{ mb: 3 }}
                    >
                      <Tab label="Customer login" icon={<LoginIcon />} iconPosition="start" />
                      <Tab label="Register customer" icon={<WorkspacePremiumIcon />} iconPosition="start" />
                    </Tabs>

                    {authTab === 0 && (
                      <Stack spacing={2.5}>
                        <TextField label="Email" type="email" fullWidth placeholder="operations@shipper.com" required />
                        <TextField label="Password" type="password" fullWidth placeholder="••••••••" required />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            Access fleet health and reservation tools instantly.
                          </Typography>
                          <Button variant="contained" color="primary" size="large">
                            Sign in
                          </Button>
                        </Stack>
                      </Stack>
                    )}

                    {authTab === 1 && (
                      <Stack spacing={2.5}>
                        <TextField label="Full name" fullWidth placeholder="Alex Carter" required />
                        <TextField label="Work email" type="email" fullWidth placeholder="you@company.com" required />
                        <TextField label="Password" type="password" fullWidth placeholder="Create a strong password" required />
                        <Button variant="contained" color="primary" size="large" fullWidth>
                          Create account
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                          Customer accounts gain booking visibility while staff and admin credentials remain centrally
                          managed.
                        </Typography>
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                <Card sx={{ border: '1px solid #e7d7ae' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <SecurityIcon color="primary" />
                        <Box>
                          <Typography variant="h6" color="secondary.main">
                            Staff & Admin entrance
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            System-issued username and password. No self-registration.
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip label="Restricted" color="secondary" variant="outlined" />
                    </Stack>

                    <ToggleButtonGroup
                      value={staffRole}
                      exclusive
                      color="primary"
                      fullWidth
                      onChange={(_, value) => value && setStaffRole(value)}
                      sx={{ mb: 3 }}
                    >
                      <ToggleButton value="STAFF">Staff</ToggleButton>
                      <ToggleButton value="ADMIN">Admin</ToggleButton>
                    </ToggleButtonGroup>

                    <Stack spacing={2.5}>
                      <TextField label="System username" fullWidth placeholder={`${staffRole.toLowerCase()}-access`} required />
                      <TextField label="System password" type="password" fullWidth placeholder="••••••••" required />
                      <Button variant="contained" color="secondary" size="large" fullWidth>
                        Enter {staffRole === 'ADMIN' ? 'admin' : 'staff'} console
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        Use the credentials issued by operations leadership to reach the {staffRole.toLowerCase()} tools.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
