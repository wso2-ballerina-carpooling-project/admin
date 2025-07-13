



import React from 'react';

interface CircularProgressProps {
  percentage: number;
  color: string;
  label: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, color, label }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-6">{label}</h3>
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const PaymentCharts = () => {
  const paymentData = [
    {
      label: 'Completed Payments',
      percentage: 58,
      color: '#3b82f6'
    },
    {
      label: 'Pending Payments',
      percentage: 42,
      color: '#ef4444'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {paymentData.map((payment, index) => (
          <CircularProgress
            key={index}
            percentage={payment.percentage}
            color={payment.color}
            label={payment.label}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentCharts;