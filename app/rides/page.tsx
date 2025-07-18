'use client';

import React, { useState } from 'react';

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const getYears = (startYear: number) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
};

const RideStatsCard = ({ title, count }: { title: string; count: number }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center w-64">
    <h3 className="text-lg font-semibold text-[#0d0d2b]">{title}</h3>
    <p className="text-4xl font-bold text-[#0d0d2b] mt-2">{count.toString().padStart(2, '0')}</p>
  </div>
);

export default function RidesPage() {
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#0d0d2b]">Filter Rides</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10">
        <select
          className="p-2 rounded bg-white border border-gray-300 shadow text-[#0d0d2b]"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          className="p-2 rounded bg-white border border-gray-300 shadow text-[#0d0d2b]"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {getYears(2010).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards in One Row */}
      <div className="flex justify-between gap-6 mb-10 overflow-x-auto">
        <RideStatsCard title="Scheduled Rides" count={114} />
        <RideStatsCard title="Ongoing Rides" count={52} />
        <RideStatsCard title="Completed Rides" count={56} />
        <RideStatsCard title="Cancelled Rides" count={6} />
      </div>

      {/* Centered Generate Report Button */}
      <div className="flex justify-center">
        <button className="bg-[#0d0d2b] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1b1b3b] transition">
          Generate Report
        </button>
      </div>
    </div>
  );
}
