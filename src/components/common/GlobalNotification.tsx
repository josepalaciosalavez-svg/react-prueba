import React, { useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide, { type SlideProps } from '@mui/material/Slide';
import { useNotificationStore } from '@/stores/notificationStore';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const GlobalNotification: React.FC = React.memo(() => {
  const open = useNotificationStore((state) => state.open);
  const message = useNotificationStore((state) => state.message);
  const severity = useNotificationStore((state) => state.severity);
  const autoHideDuration = useNotificationStore((state) => state.autoHideDuration);
  const hideNotification = useNotificationStore((state) => state.hideNotification);

  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      hideNotification();
    },
    [hideNotification]
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      slots={{ transition: SlideTransition }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        zIndex: (theme) => theme.zIndex.snackbar + 100,
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        elevation={6}
        sx={{
          minWidth: { xs: '280px', sm: '320px' },
          maxWidth: { xs: '90vw', sm: '480px' },
          borderRadius: 2,
          fontWeight: 500,
          fontSize: '0.875rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          alignItems: 'center',
          '& .MuiAlert-icon': {
            fontSize: '1.25rem',
          },
          '& .MuiAlert-action': {
            pt: 0,
            mr: -0.5,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
});

GlobalNotification.displayName = 'GlobalNotification';

export default GlobalNotification;
