import React, { forwardRef, memo, useMemo } from 'react';
import {
  Typography as MuiTypography,
  type TypographyProps as MuiTypographyProps,
} from '@mui/material';

export interface GlobalTypographyProps extends MuiTypographyProps {
  weight?: 300 | 400 | 500 | 600 | 700 | 800 | 900 | string | number;
}


function arePropsEqual(
  prevProps: GlobalTypographyProps,
  nextProps: GlobalTypographyProps
): boolean {
  if (prevProps === nextProps) return true;

  if (
    prevProps.children !== nextProps.children ||
    prevProps.variant !== nextProps.variant ||
    prevProps.weight !== nextProps.weight ||
    prevProps.color !== nextProps.color ||
    prevProps.align !== nextProps.align ||
    prevProps.noWrap !== nextProps.noWrap ||
    prevProps.component !== nextProps.component ||
    prevProps.className !== nextProps.className
  ) {
    return false;
  }

  const prevSx = prevProps.sx;
  const nextSx = nextProps.sx;

  if (prevSx !== nextSx) {
    if (!prevSx || !nextSx) return false;

    if (
      typeof prevSx === 'object' &&
      typeof nextSx === 'object' &&
      !Array.isArray(prevSx) &&
      !Array.isArray(nextSx)
    ) {
      const prevKeys = Object.keys(prevSx);
      const nextKeys = Object.keys(nextSx);

      if (prevKeys.length !== nextKeys.length) return false;

      for (const key of prevKeys) {
        if (
          (prevSx as Record<string, unknown>)[key] !==
          (nextSx as Record<string, unknown>)[key]
        ) {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  const allKeys = new Set([...Object.keys(prevProps), ...Object.keys(nextProps)]);
  for (const key of allKeys) {
    if (
      key === 'children' ||
      key === 'variant' ||
      key === 'weight' ||
      key === 'color' ||
      key === 'align' ||
      key === 'noWrap' ||
      key === 'component' ||
      key === 'className' ||
      key === 'sx'
    ) {
      continue;
    }

    if (
      (prevProps as Record<string, unknown>)[key] !==
      (nextProps as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }

  return true;
}

const GlobalTypographyBase = forwardRef<HTMLElement, GlobalTypographyProps>(
  ({ children, weight, sx, ...rest }, ref) => {
    const computedSx = useMemo(() => {
      if (!weight) return sx;
      if (Array.isArray(sx)) {
        return [{ fontWeight: weight }, ...sx];
      }
      return {
        fontWeight: weight,
        ...sx,
      };
    }, [weight, sx]);

    return (
      <MuiTypography
        ref={ref as React.Ref<any>}
        sx={computedSx}
        {...rest}
      >
        {children}
      </MuiTypography>
    );
  }
);

GlobalTypographyBase.displayName = 'GlobalTypography';

export const GlobalTypography = memo(GlobalTypographyBase, arePropsEqual);

export default GlobalTypography;
