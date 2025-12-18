'use client';

import { useStrataScheme } from '@/contexts/StrataSchemeContext';
import { ManagerDashboard } from '@/components/ManagerDashboard';
import { MainLayout } from '@/components/MainLayout';

export default function ManagersPage() {
  const { currentScheme } = useStrataScheme();

  return (
    <MainLayout showCreateButton={false}>
      {currentScheme ? (
        <ManagerDashboard schemeId={currentScheme.id} />
      ) : (
        <div>Please select a strata scheme</div>
      )}
    </MainLayout>
  );
}
