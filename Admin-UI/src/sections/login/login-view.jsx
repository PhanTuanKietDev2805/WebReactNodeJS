import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { setLocalStorage } from 'src/utils/sessionStorage';

import { bgGradient } from 'src/theme/css';
import customerApi from 'src/api/customer';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    const res = await customerApi.login(form);
    if (!res.status || res.status !== 200) {
      setError('Login Error! Please try again');
    } else {
      setLocalStorage('adminToken', res.data.token);
      router.push('/');
    }
  };

  const handleChangeEmail = (e) => {
    e.preventDefault();
    setForm((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setForm((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <p> {error}</p>
        <TextField
          name="email"
          label="Email address"
          value={form.email}
          onChange={handleChangeEmail}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={form.password}
          onChange={handleChangePassword}
        />
      </Stack>

      <LoadingButton
        sx={{ my: 3 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Login Admin Dashboard</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
