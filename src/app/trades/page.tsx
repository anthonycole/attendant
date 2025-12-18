'use client';

import React from 'react';
import { TradesDirectory } from '@/components/directory/TradesDirectory';
import { MainLayout } from '@/components/MainLayout';
import type { Trade } from '@/types/trades';

export default function TradesPage() {
  const handleEditTrade = (trade: Trade) => {
    console.log('Edit trade:', trade);
    // TODO: Implement edit functionality
  };

  const handleDeleteTrade = (tradeId: string) => {
    console.log('Delete trade:', tradeId);
    // TODO: Implement delete functionality
  };

  const handleCreateTrade = () => {
    console.log('Create new trade');
    // TODO: Implement create functionality
  };

  return (
    <MainLayout>
      <TradesDirectory
        onEditTrade={handleEditTrade}
        onDeleteTrade={handleDeleteTrade}
        onCreateTrade={handleCreateTrade}
      />
    </MainLayout>
  );
}