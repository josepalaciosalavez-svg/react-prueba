import React, { forwardRef } from 'react';
import {
  Button as MuiButton,
  CircularProgress,
  type ButtonProps as MuiButtonProps,
} from '@mui/material';

export interface GlobalButtonProps extends MuiButtonProps {
  /**
   * Muestra un indicador de carga circular y deshabilita la interacción
   */
  loading?: boolean;
  /**
   * Texto alternativo a mostrar mientras loading esté activo
   */
  loadingText?: React.ReactNode;
  /**
   * Tamaño personalizado para el spinner de carga (en px)
   */
  spinnerSize?: number;
}

const getSpinnerSize = (size: MuiButtonProps['size'], customSize?: number): number => {
  if (customSize) return customSize;
  switch (size) {
    case 'small':
      return 16;
    case 'large':
      return 22;
    case 'medium':
    default:
      return 18;
  }
};

export const GlobalButton = forwardRef<HTMLButtonElement, GlobalButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText,
      spinnerSize,
      disabled,
      startIcon,
      variant = 'contained',
      size = 'medium',
      sx,
      ...rest
    },
    ref
  ) => {
    const computedSpinnerSize = getSpinnerSize(size, spinnerSize);

    // Si está cargando y hay un icono de inicio, reemplazamos temporalmente el icono por el spinner
    const computedStartIcon = loading ? (
      <CircularProgress size={computedSpinnerSize} color="inherit" />
    ) : (
      startIcon
    );

    // Si está cargando y no hay icono pero tampoco loadingText, podemos mostrar el spinner como icono inicial
    const resolvedStartIcon = loading && !startIcon && !loadingText ? (
      <CircularProgress size={computedSpinnerSize} color="inherit" sx={{ mr: 1 }} />
    ) : (
      computedStartIcon
    );

    // Estilos base según la variante para mantener consistencia con el diseño de Liverpool
    const baseSx = {
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: 2,
      transition: 'all 0.15s ease-in-out',
      ...(variant === 'outlined' && {
        borderColor: '#CBD5E1',
        color: '#334155',
        '&:hover': {
          borderColor: '#94A3B8',
          backgroundColor: '#F8FAFC',
        },
      }),
      ...(variant === 'contained' &&
        (!rest.color || rest.color === 'primary') && {
        backgroundColor: '#E10098',
        color: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(225, 0, 152, 0.25)',
        '&:hover': {
          backgroundColor: '#C20083',
          boxShadow: '0 4px 12px rgba(225, 0, 152, 0.35)',
        },
      }),
      ...sx,
    };

    return (
      <MuiButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        startIcon={resolvedStartIcon}
        sx={baseSx}
        {...rest}
      >
        {loading && loadingText ? loadingText : children}
      </MuiButton>
    );
  }
);

GlobalButton.displayName = 'GlobalButton';

export default GlobalButton;
