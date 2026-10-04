import React, { memo } from 'react';
import { Avatar, Box, Card, CardContent, Chip, Divider } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import { GlobalTypography } from '@/components/common';
import { UserStatusChip } from './UserStatusChip';
import type { SystemUser } from '@/types/user';

interface UserCardProps {
  user: SystemUser;
}

export const UserCard: React.FC<UserCardProps> = memo(({ user }) => {
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  const initial = (user.nombre || user.email || 'U').charAt(0).toUpperCase();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#FDF2F8',
                color: '#E10098',
                fontWeight: 700,
                fontSize: '1rem',
                border: '1px solid #FCE7F3',
              }}
            >
              {initial}
            </Avatar>
            <Box>
              <GlobalTypography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {user.nombre}
              </GlobalTypography>
              <GlobalTypography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                {user.email}
              </GlobalTypography>
            </Box>
          </Box>
          <UserStatusChip status={user.status} />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, my: 1.25 }}>
          {Array.isArray(user.roles) && user.roles.length > 0 ? (
            user.roles.map((role) => {
              const isAdmin = role.includes('ADMIN');
              return (
                <Chip
                  key={role}
                  label={role.replace('ROLE_', '')}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.675rem',
                    height: 20,
                    borderRadius: 1,
                    backgroundColor: isAdmin ? '#FDF2F8' : '#EFF6FF',
                    color: isAdmin ? '#E10098' : '#2563EB',
                    border: `1px solid ${isAdmin ? '#FCE7F3' : '#DBEAFE'}`,
                  }}
                />
              );
            })
          ) : (
            <Chip
              label="SIN ROL"
              size="small"
              sx={{ height: 20, fontSize: '0.675rem', backgroundColor: '#F1F5F9', color: '#64748B' }}
            />
          )}
        </Box>

        <Divider sx={{ my: 1.25, borderColor: '#F1F5F9' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <FingerprintOutlinedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
            <GlobalTypography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748B', fontWeight: 600 }}>
              {user.id}
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

UserCard.displayName = 'UserCard';

export default UserCard;
