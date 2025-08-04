



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

interface PaymentsData {
  payment: any[];
  count: number;
  payeed: number;
  notpayeed: number;
}

interface RidesData {
  rides: any[];
  count?: number;
}

interface PaymentChartsProps {
  paymentsData: PaymentsData | null;
  ridesData: RidesData | null;
  loading: boolean;
}

const PaymentCharts: React.FC<PaymentChartsProps> = ({ paymentsData, ridesData, loading }) => {
  // Calculate payment percentages from real data
  const getPaymentData = () => {
    if (!paymentsData || loading) {
      return [
        {
          label: 'Completed Payments',
          percentage: 0,
          color: '#3b82f6'
        },
        {
          label: 'Pending Payments',
          percentage: 0,
          color: '#ef4444'
        }
      ];
    }

    const totalPayments = paymentsData.count;
    const completedPercentage = totalPayments > 0 ? Math.round((paymentsData.payeed / totalPayments) * 100) : 0;
    const pendingPercentage = totalPayments > 0 ? Math.round((paymentsData.notpayeed / totalPayments) * 100) : 0;

    return [
      {
        label: 'Completed Payments',
        percentage: completedPercentage,
        color: '#3b82f6'
      },
      {
        label: 'Pending Payments',
        percentage: pendingPercentage,
        color: '#ef4444'
      }
    ];
  };

  const paymentData = getPaymentData();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Status</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="text-gray-500">Loading payment data...</span>
        </div>
      ) : (
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
      )}
      
      {/* Payment Summary */}
      {paymentsData && !loading && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{paymentsData.payeed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{paymentsData.notpayeed}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{paymentsData.count}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCharts;