import React, { memo } from 'react';
import { GlobalSkeleton } from '@/components/common';

export const UsersSkeleton: React.FC = memo(() => {
  return <GlobalSkeleton variant="responsive" rows={6} rowHeight={52} cardHeight={175} />;
});

UsersSkeleton.displayName = 'UsersSkeleton';

export default UsersSkeleton;
