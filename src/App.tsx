import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { liverpoolTheme } from '@/theme/theme';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { GlobalNotification } from '@/components/common/GlobalNotification';
import { AppRoutes } from '@/routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={liverpoolTheme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <GlobalNotification />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
