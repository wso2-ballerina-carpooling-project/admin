import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
      </div>
    </div>
  );
}