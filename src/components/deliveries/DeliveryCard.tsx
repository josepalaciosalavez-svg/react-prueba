import React, { memo } from 'react';
import { Box, Card, CardContent, Divider } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import { GlobalTypography, StatusChip } from '@/components/common';
import type { Delivery } from '@/types/delivery';

interface DeliveryCardProps {
  delivery: Delivery;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = memo(({ delivery }) => {
  const formattedDate = delivery.createdAt
    ? new Date(delivery.createdAt).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        transition: 'border-color 0.15s ease',
        '&:hover': {
          borderColor: '#CBD5E1',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: '#FDF2F8',
                color: '#E10098',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <PlaceOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <GlobalTypography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                {delivery.direccionEnvio}
              </GlobalTypography>
            </Box>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <StatusChip status={delivery.status} size="small" />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.25 }}>
          <PersonOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Box>
            <GlobalTypography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
              {delivery.nombreCliente || 'Cliente no asignado'}
            </GlobalTypography>
            <GlobalTypography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#64748B',
                fontSize: '0.75rem',
              }}
            >
              Cliente ID: {delivery.clienteId}
            </GlobalTypography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.25, borderColor: '#F1F5F9' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <FingerprintOutlinedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
            <GlobalTypography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748B', fontWeight: 600 }}>
              {delivery.id}
            </GlobalTypography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
            <GlobalTypography variant="caption" sx={{ color: '#64748B' }}>
              {formattedDate}
            </GlobalTypography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

DeliveryCard.displayName = 'DeliveryCard';

export default DeliveryCard;
