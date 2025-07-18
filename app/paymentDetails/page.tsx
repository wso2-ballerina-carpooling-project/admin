'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PaymentPage() {
  const paymentData = [
    {
      empId: '000001',
      carNo: 'ABC-1234',
      driver: 'Noah Fedel',
      secondaryInfo: 'Secondary info',
      payment: 'Rs.2700',
      status: 'Pending'
    },
    {
      empId: '000002',
      carNo: 'XYZ-4321',
      driver: 'Alex Carter',
      secondaryInfo: 'Secondary info',
      payment: 'Rs.5200',
      status: 'Pending'
    },
    {
      empId: '000003',
      carNo: 'PQR-5874',
      driver: 'Isaac Reuben',
      secondaryInfo: 'Secondary info',
      payment: 'Rs.7500',
      status: 'Complete'
    },
    {
      empId: '000004',
      carNo: 'AAQ-5214',
      driver: 'Asher Reed',
      secondaryInfo: 'Secondary info',
      payment: 'Rs.4000',
      status: 'Pending'
    },
    {
      empId: '000005',
      carNo: 'BCD-2485',
      driver: 'Mason Bryer',
      secondaryInfo: 'Secondary info',
      payment: 'Rs.5500',
      status: 'Complete'
    },
    {
      empId: '000006',
      carNo: 'XYZ-5201',
      driver: 'James Potter',
      secondaryInfo: 'Secondary info',
      payment: 'Rs.6000',
      status: 'Pending'
    }
  ];

  const [selectedYear, setSelectedYear] = useState('2024');
  
  // Sample data for multiple years
  const yearlyData = {
    '2023': [12000, 15000, 18000, 14000, 16000, 19000, 21000, 23000, 20000, 17000, 19000, 22000],
    '2024': [14000, 17000, 20000, 16000, 18000, 21000, 23000, 25000, 22000, 19000, 21000, 24000],
    '2025': [16000, 19000, 22000, 18000, 20000, 23000, 25000, 27000, 24000, 21000, 23000, 26000],
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Cost (Rs)',
      data: yearlyData[selectedYear as keyof typeof yearlyData],
      backgroundColor: '#0d0d2b',
      borderRadius: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Rs. ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
          callback: (value: any) => {
            return `Rs. ${value.toLocaleString()}`;
          }
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-8">
      {/* Payment Status Section */}
      <section>
        <h1 className="text-xl font-bold mb-4 text-[#0d0d2b]">Payment Status</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-[#0d0d2b]">
              <tr>
                <th className="py-2 px-3 text-left text-xs text-white">Emp.ID</th>
                <th className="py-2 px-3 text-left text-xs text-white">Car No.</th>
                <th className="py-2 px-3 text-left text-xs text-white">Driver</th>
                <th className="py-2 px-3 text-left text-xs text-white">Payment</th>
                <th className="py-2 px-3 text-left text-xs text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {paymentData.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-3 text-xs text-[#0d0d2b]">{item.empId}</td>
                  <td className="py-2 px-3 text-xs text-[#0d0d2b]">{item.carNo}</td>
                  <td className="py-2 px-3">
                    <div>
                      <p className="text-xs font-medium text-[#0d0d2b]">{item.driver}</p>
                      <p className="text-xs text-gray-600">{item.secondaryInfo}</p>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-xs font-medium text-[#0d0d2b]">{item.payment}</td>
                  <td className="py-2 px-2">
                    <span className={`px-1 py-0.5 rounded-full text-2xs ${
                      item.status === 'Complete' 
                        ? 'bg-green-100 text-green-800 text-xs' 
                        : 'bg-yellow-100 text-yellow-800 text-xs'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transaction History Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0d0d2b]">Transaction History</h2>
            <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Year:</span>
            <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-400 rounded p-1 text-xs text-[#0d0d2b] bg-white"
            >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
            </select>
            </div>
        </div>

        {/* Monthly Cost Graph */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="h-[300px] mb-2">
            <Bar  options={chartOptions} data={chartData} />
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
            Hover over bars to see exact amounts
            </div>
        </div>
      </section>
    </div>
    );
}
