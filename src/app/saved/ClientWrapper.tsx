'use client';

import dynamic from 'next/dynamic';

const SavedItemsClient = dynamic(
  () => import('@/components/SavedItemsClient'),
  { ssr: false }
);

export default function ClientWrapper() {
  return <SavedItemsClient />;
}