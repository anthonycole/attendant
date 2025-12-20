'use client';

import { MainLayout } from '@/components/MainLayout';
import { FeaturesOverview } from '@/components/FeaturesOverview';

export default function FeaturesPage() {
  return (
    <MainLayout showCreateButton={false}>
      <FeaturesOverview />
    </MainLayout>
  );
}
