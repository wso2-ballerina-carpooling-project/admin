// 'use client';
// import StatCard from '@/components/StatCard';
// import { FaCarSide, FaUserPlus } from 'react-icons/fa';
// import { MdCancel } from 'react-icons/md';
// import PaymentCharts from '@/components/PaymentCharts';

// export default function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard label="Booked Rides" value="150" icon={<FaCarSide size={30} />} />
//         <StatCard label="Cancelled Rides" value="09" icon={<MdCancel size={30} />} />
//         <StatCard label="New Users" value="15" icon={<FaUserPlus size={30} />} />
//       </div>
//       <div>
//         <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
//         <PaymentCharts />
//       </div>
//     </div>
//   );
// }

import React from 'react';
import StatCard from '@/components/StatCard';
import PaymentCharts from '@/components/PaymentCharts';
import { Car, X, User } from 'lucide-react';

const DashboardPage = () => {
  const statsData = [
    {
      title: 'Booked Rides',
      value: '150',
      icon: Car,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600'
    },
    {
      title: 'Cancelled Rides',
      value: '09',
      bgColor: 'bg-gray-100',
      iconColor: 'text-white',
      valueColor: 'text-gray-600',
      iconBg: 'bg-gray-800',
      customIcon: '✕'
    },
    {
      title: 'New Users',
      value: '15',
      bgColor: 'bg-blue-100',
      iconColor: 'text-white',
      valueColor: 'text-blue-600',
      iconBg: 'bg-gray-800',
      customIcon: 'N'
    }
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Payment Status */}
      <PaymentCharts />
    </>
  );
};

export default DashboardPage;