import React, { memo, useId, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  type SxProps,
  type Theme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { GlobalTypography } from './GlobalTypography';

export interface GlobalModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  headerBadgeColor?: {
    bg?: string;
    color?: string;
  };
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  loading?: boolean;
  hideCloseButton?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  paperSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  actionsSx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
}

export const GlobalModal: React.FC<GlobalModalProps> = memo(({
  open,
  onClose,
  title,
  subtitle,
  icon,
  headerBadgeColor,
  children,
  actions,
  maxWidth = 'xs',
  fullWidth = true,
  loading = false,
  hideCloseButton = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  paperSx,
  contentSx,
  actionsSx,
  titleSx,
}) => {
  const titleId = useId();
  const descriptionId = useId();

  const handleDialogClose = useCallback(
    (_event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
      if (loading) return;
      if (reason === 'backdropClick' && disableBackdropClick) return;
      if (reason === 'escapeKeyDown' && disableEscapeKeyDown) return;
      onClose();
    },
    [loading, disableBackdropClick, disableEscapeKeyDown, onClose]
  );

  const handleIconButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!loading) {
        onClose();
      }
    },
    [loading, onClose]
  );

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={descriptionId}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
          },
        },
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            border: '1px solid #E2E8F0',
            ...paperSx,
          },
        },
      }}
    >
      {!hideCloseButton && (
        <IconButton
          aria-label="Cerrar modal"
          onClick={handleIconButtonClick}
          disabled={loading}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#94A3B8',
            '&:hover': {
              color: '#0F172A',
              backgroundColor: '#F1F5F9',
            },
            transition: 'all 0.15s ease-in-out',
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      )}

      {(title || icon) && (
        <DialogTitle
          id={titleId}
          component="div"
          sx={{
            pb: 1,
            pt: 1.5,
            pr: hideCloseButton ? 2 : 5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            ...titleSx,
          }}
        >
          {icon && (
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                backgroundColor: headerBadgeColor?.bg || '#F1F5F9',
                color: headerBadgeColor?.color || '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}

          <Box sx={{ minWidth: 0, flex: 1 }}>
            {typeof title === 'string' ? (
              <GlobalTypography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  fontSize: '1.125rem',
                  display: 'block',
                  lineHeight: 1.3,
                }}
              >
                {title}
              </GlobalTypography>
            ) : (
              title
            )}

            {subtitle && (
              <GlobalTypography
                variant="caption"
                sx={{
                  color: '#64748B',
                  display: 'block',
                  mt: 0.25,
                  fontSize: '0.8rem',
                }}
              >
                {subtitle}
              </GlobalTypography>
            )}
          </Box>
        </DialogTitle>
      )}

      <DialogContent id={descriptionId} sx={{ py: 1.5, px: 2.5, ...contentSx }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            px: 2.5,
            pb: 2,
            pt: 1,
            gap: 1,
            borderTop: '1px solid #F1F5F9',
            ...actionsSx,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
});

GlobalModal.displayName = 'GlobalModal';

export default GlobalModal;
