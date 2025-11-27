import { ChangeEvent, FormEvent, ReactNode, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
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
import {
  LoadingButton,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SecurityIcon from '@mui/icons-material/Security';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import MapIcon from '@mui/icons-material/Map';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InsightsIcon from '@mui/icons-material/Insights';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { apiBaseUrl, loginCustomer, loginSystemUser, registerCustomer } from './api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0b4f6c',
    },
    background: {
      default: '#f6f9fe',
      paper: '#ffffff',
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700 },
    body1: { color: '#2c3b50' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: '#e3e8f0',
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 700,
          letterSpacing: '-0.01em',
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

type AuthFeedback = { type: 'success' | 'error'; message: string };
type Highlight = { icon: ReactNode; label: string; detail: string };
type Metric = { label: string; value: number; suffix?: string };
type JourneyStep = { title: string; detail: string };
type QuickAction = { label: string; subtitle: string };

function App() {
  const [authTab, setAuthTab] = useState(0);
  const [staffRole, setStaffRole] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [customerLoginForm, setCustomerLoginForm] = useState({ email: '', password: '' });
  const [registrationForm, setRegistrationForm] = useState({ name: '', email: '', password: '' });
  const [systemLoginForm, setSystemLoginForm] = useState({ username: '', password: '' });
  const [customerLoginLoading, setCustomerLoginLoading] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [systemLoginLoading, setSystemLoginLoading] = useState(false);
  const [customerLoginFeedback, setCustomerLoginFeedback] = useState<AuthFeedback | null>(null);
  const [registrationFeedback, setRegistrationFeedback] = useState<AuthFeedback | null>(null);
  const [systemLoginFeedback, setSystemLoginFeedback] = useState<AuthFeedback | null>(null);
  const [searchTerm, setSearchTerm] = useState('cold chain status');

  const highlights = useMemo<Highlight[]>(
    () => [
      {
        icon: <WorkspacePremiumIcon />,
        label: 'Regulated fleet ready',
        detail: 'Temperature control and compliance baked in for sensitive cargo.',
      },
      {
        icon: <Inventory2Icon />,
        label: 'Live inventory posture',
        detail: 'Track dispatch readiness, handoffs, and reservations in one view.',
      },
      {
        icon: <SecurityIcon />,
        label: 'Role-based controls',
        detail: 'Separate staff and admin entrances with system credentials.',
      },
    ],
    [],
  );

  const metrics = useMemo<Metric[]>(
    () => [
      { label: 'Active cold units', value: 412 },
      { label: 'Geofenced lanes', value: 62 },
      { label: 'Service uptime', value: 99.98, suffix: '%' },
    ],
    [],
  );

  const journey = useMemo<JourneyStep[]>(
    () => [
      { title: 'Signal incoming demand', detail: 'Customers pre-verify availability and temperature brackets.' },
      { title: 'Secure the capacity', detail: 'Staff confirm lane readiness while admins gatekeep credentials.' },
      {
        title: 'Audit and trace',
        detail: 'Every move is logged so leadership sees who touched each shipment and when.',
      },
    ],
    [],
  );

  const quickActions = useMemo<QuickAction[]>(
    () => [
      { label: 'Cold chain status', subtitle: 'Real-time telemetry for critical cargo' },
      { label: 'Network heatmap', subtitle: 'Origin-destination health by lane' },
      { label: 'Role admin rules', subtitle: 'Trace which teams can approve loads' },
      { label: 'Reservation backlog', subtitle: 'Queue of pending booking requests' },
      { label: 'Fleet certification', subtitle: 'Equipment with verified audits' },
    ],
    [],
  );

  const handleSystemFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSystemLoginForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleRegistrationFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegistrationForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleCustomerLoginFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCustomerLoginForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleCustomerLogin = async (event: FormEvent) => {
    event.preventDefault();
    setCustomerLoginFeedback(null);
    setCustomerLoginLoading(true);

    try {
      const { token } = await loginCustomer(customerLoginForm);
      const preview = token ? `${token.slice(0, 12)}…` : 'received';
      setCustomerLoginFeedback({ type: 'success', message: `Authenticated. Token ${preview}` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      setCustomerLoginFeedback({ type: 'error', message });
    } finally {
      setCustomerLoginLoading(false);
    }
  };

  const handleRegistration = async (event: FormEvent) => {
    event.preventDefault();
    setRegistrationFeedback(null);
    setRegistrationLoading(true);

    try {
      const user = await registerCustomer(registrationForm);
      setRegistrationFeedback({
        type: 'success',
        message: `Account created for ${user.name || 'customer'} (${user.email}).`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to register at the moment.';
      setRegistrationFeedback({ type: 'error', message });
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleSystemLogin = async (event: FormEvent) => {
    event.preventDefault();
    setSystemLoginFeedback(null);
    setSystemLoginLoading(true);

    try {
      const { user, token } = await loginSystemUser(systemLoginForm);
      const preview = token ? `${token.slice(0, 12)}…` : 'issued';
      setSystemLoginFeedback({
        type: 'success',
        message: `${user.role} session established. Token ${preview}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to authenticate system user.';
      setSystemLoginFeedback({ type: 'error', message });
    } finally {
      setSystemLoginLoading(false);
    }
  };

  const filteredQuickActions = quickActions
    .filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 3);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: `radial-gradient(circle at 20% 20%, rgba(26,115,232,0.09) 0%, transparent 30%),
            radial-gradient(circle at 80% 10%, rgba(11,79,108,0.08) 0%, transparent 28%),
            linear-gradient(180deg, #f6f9fe 0%, #eef3fb 100%)`,
          pb: 10,
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          color="transparent"
          sx={{ borderBottom: '1px solid #e2e8f0', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(10px)' }}
        >
          <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'primary.main',
                borderRadius: 2.2,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.contrastText',
                fontWeight: 800,
                boxShadow: '0 12px 28px rgba(26, 115, 232, 0.35)',
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
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Card sx={{ border: '1px solid #dbe5ff', boxShadow: '0 24px 50px rgba(26,115,232,0.08)' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={2.5}>
                        <Chip label="Inventory intelligence" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                        <Typography variant="h3" color="secondary.main">
                          Google-fast visibility for every pallet and power unit
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Search shipments like the web. Discover readiness insights, unlock role-specific consoles, and
                          track compliance without pausing operations.
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            bgcolor: '#f9fbff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                          }}
                        >
                          <TextField
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search inventory like google: 'Where are the cold-chain units near JFK?'"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon color="primary" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton color="primary" size="small">
                                    <EmojiObjectsIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {filteredQuickActions.map((item) => (
                              <Chip
                                key={item.label}
                                color="primary"
                                variant="outlined"
                                label={`${item.label} · ${item.subtitle}`}
                                sx={{ borderRadius: 2 }}
                              />
                            ))}
                          </Stack>
                        </Paper>
                        <Grid container spacing={2}>
                          {metrics.map((metric) => (
                            <Grid key={metric.label} item xs={12} sm={4}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 3,
                                  border: '1px solid #e7ecf5',
                                  bgcolor: 'rgba(26,115,232,0.04)',
                                }}
                              >
                                <Typography variant="overline" color="text.secondary">
                                  {metric.label}
                                </Typography>
                                <Typography variant="h4" color="primary.main">
                                  <CountUp end={metric.value} decimals={metric.suffix ? 2 : 0} duration={1.6} />
                                  {metric.suffix}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                        <Divider />
                        <Stack spacing={1.5}>
                          {highlights.map((item) => (
                            <Stack
                              key={item.label}
                              direction="row"
                              spacing={2}
                              alignItems="flex-start"
                              sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(26, 115, 232, 0.06)' }}
                            >
                              <Avatar sx={{ bgcolor: 'primary.main', color: 'white', width: 44, height: 44 }}>
                                {item.icon}
                              </Avatar>
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
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <Card sx={{ border: '1px solid #dce7ff' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" color="secondary.main">
                            Live operations story
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Every authentication request unlocks a measured workflow. Watch inventory readiness progress
                            down the chain.
                          </Typography>
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: 240 } }}>
                          <LinearProgress variant="determinate" value={82} sx={{ height: 10, borderRadius: 5 }} />
                          <Typography variant="caption" color="text.secondary">
                            82% of today\'s bookings ready for dispatch
                          </Typography>
                        </Box>
                      </Stack>
                      <Timeline position="alternate" sx={{ mt: 2 }}>
                        {journey.map((step, index) => (
                          <TimelineItem key={step.title}>
                            <TimelineSeparator>
                              <TimelineDot color="primary" />
                              {index !== journey.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="subtitle1" fontWeight={700} color="secondary.main">
                                {step.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {step.detail}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </CardContent>
                  </Card>
                </motion.div>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
                  <Card sx={{ border: '1px solid #dce7ff', boxShadow: '0 12px 34px rgba(15, 23, 42, 0.06)' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Tabs
                        value={authTab}
                        onChange={(_, value: number) => setAuthTab(value)}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="fullWidth"
                        sx={{ mb: 3 }}
                      >
                        <Tab label="Customer login" icon={<LoginIcon />} iconPosition="start" />
                        <Tab label="Register customer" icon={<WorkspacePremiumIcon />} iconPosition="start" />
                      </Tabs>

                      {authTab === 0 && (
                        <Box component="form" onSubmit={handleCustomerLogin} noValidate>
                          <Stack spacing={2.5}>
                            <TextField
                              label="Email"
                              type="email"
                              fullWidth
                              placeholder="operations@shipper.com"
                              required
                              name="email"
                              value={customerLoginForm.email}
                              onChange={handleCustomerLoginFieldChange}
                            />
                            <TextField
                              label="Password"
                              type="password"
                              fullWidth
                              placeholder="••••••••"
                              required
                              name="password"
                              value={customerLoginForm.password}
                              onChange={handleCustomerLoginFieldChange}
                            />
                            {customerLoginFeedback && (
                              <Alert severity={customerLoginFeedback.type}>{customerLoginFeedback.message}</Alert>
                            )}
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" color="text.secondary">
                                Access fleet health and reservation tools instantly.
                              </Typography>
                              <LoadingButton
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                                loading={customerLoginLoading}
                              >
                                Sign in
                              </LoadingButton>
                            </Stack>
                          </Stack>
                        </Box>
                      )}

                      {authTab === 1 && (
                        <Box component="form" onSubmit={handleRegistration} noValidate>
                          <Stack spacing={2.5}>
                            <TextField
                              label="Full name"
                              fullWidth
                              placeholder="Alex Carter"
                              required
                              name="name"
                              value={registrationForm.name}
                              onChange={handleRegistrationFieldChange}
                            />
                            <TextField
                              label="Work email"
                              type="email"
                              fullWidth
                              placeholder="you@company.com"
                              required
                              name="email"
                              value={registrationForm.email}
                              onChange={handleRegistrationFieldChange}
                            />
                            <TextField
                              label="Password"
                              type="password"
                              fullWidth
                              placeholder="Create a strong password"
                              required
                              name="password"
                              value={registrationForm.password}
                              onChange={handleRegistrationFieldChange}
                            />
                            {registrationFeedback && (
                              <Alert severity={registrationFeedback.type}>{registrationFeedback.message}</Alert>
                            )}
                            <LoadingButton
                              variant="contained"
                              color="primary"
                              size="large"
                              fullWidth
                              type="submit"
                              loading={registrationLoading}
                            >
                              Create account
                            </LoadingButton>
                            <Typography variant="body2" color="text.secondary">
                              Customer accounts gain booking visibility while staff and admin credentials remain centrally
                              managed.
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
                  <Card sx={{ border: '1px solid #dce7ff' }}>
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
                        onChange={(_, value: 'STAFF' | 'ADMIN') => value && setStaffRole(value)}
                        sx={{ mb: 3 }}
                      >
                        <ToggleButton value="STAFF">Staff</ToggleButton>
                        <ToggleButton value="ADMIN">Admin</ToggleButton>
                      </ToggleButtonGroup>

                      <Box component="form" onSubmit={handleSystemLogin} noValidate>
                        <Stack spacing={2.5}>
                          <TextField
                            label="System username"
                            fullWidth
                            placeholder={staffRole === 'ADMIN' ? 'pcn-admin' : 'pcn-staff'}
                            required
                            name="username"
                            value={systemLoginForm.username}
                            onChange={handleSystemFieldChange}
                            helperText="Default credentials: pcn-admin / ChangeMeAdmin! or pcn-staff / ChangeMeStaff!"
                          />
                          <TextField
                            label="System password"
                            type="password"
                            fullWidth
                            placeholder="••••••••"
                            required
                            name="password"
                            value={systemLoginForm.password}
                            onChange={handleSystemFieldChange}
                          />
                          {systemLoginFeedback && (
                            <Alert severity={systemLoginFeedback.type}>{systemLoginFeedback.message}</Alert>
                          )}
                          <LoadingButton
                            variant="contained"
                            color="secondary"
                            size="large"
                            fullWidth
                            type="submit"
                            loading={systemLoginLoading}
                          >
                            {`Enter ${staffRole === 'ADMIN' ? 'admin' : 'staff'} console`}
                          </LoadingButton>
                          <Typography variant="body2" color="text.secondary">
                            Use the credentials issued by operations leadership to reach the {staffRole.toLowerCase()} tools.
                          </Typography>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <Card sx={{ border: '1px solid #dce7ff' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#e3f2fd', color: 'primary.main' }}>
                          <CloudDoneIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Frontend is configured to call <strong>{apiBaseUrl}</strong>. Ensure the backend is running with
                            CORS pointing to this origin.
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Chip icon={<InsightsIcon />} label="Live charts" variant="outlined" color="primary" />
                            <Chip icon={<VerifiedUserIcon />} label="Audit ready" variant="outlined" color="secondary" />
                            <Chip icon={<MapIcon />} label="Geofenced" variant="outlined" />
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
