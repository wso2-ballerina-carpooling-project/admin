'use client';

import React, { useState, useEffect } from 'react';
import { Car, Clock, CheckCircle, XCircle, Calendar, Download, Filter, Activity } from 'lucide-react';

const months = [
  { name: 'January', value: 1 }, { name: 'February', value: 2 },
  { name: 'March', value: 3 }, { name: 'April', value: 4 },
  { name: 'May', value: 5 }, { name: 'June', value: 6 },
  { name: 'July', value: 7 }, { name: 'August', value: 8 },
  { name: 'September', value: 9 }, { name: 'October', value: 10 },
  { name: 'November', value: 11 }, { name: 'December', value: 12 }
];

const getYears = (startYear: number) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years.reverse();
};

interface RideStatsCardProps {
  title: string;
  count: number;
  isLoading: boolean;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

const RideStatsCard: React.FC<RideStatsCardProps> = ({ 
  title, 
  count, 
  isLoading, 
  icon: Icon, 
  bgColor, 
  iconColor, 
  textColor 
}) => (
  <div className={`${bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${bgColor} ring-2 ring-white`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>
            {isLoading ? '...' : count.toString().padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function RidesPage() {
  // State for the filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State to hold the statistics from the API
  const [rideStats, setRideStats] = useState({
    totalRides: 0,
    ongoingRides: 0,
    completedRides: 0,
    cancelledRides: 0,
  });

  const [ridesData, setRidesData] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Parse date from DD/MM/YYYY format
  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Filter rides by selected month and year
  const filterRidesByDate = (rides: any[], selectedMonth: number, selectedYear: number) => {
    return rides.filter((ride: any) => {
      const rideDate = parseDate(ride.date);
      if (!rideDate) return false;
      
      return rideDate.getMonth() + 1 === selectedMonth && 
             rideDate.getFullYear() === selectedYear;
    });
  };

  // Calculate statistics from real data
  const calculateStats = (data: any, selectedMonth: number, selectedYear: number) => {
    if (!data || !data.rides) return {
      totalRides: 0,
      ongoingRides: 0,
      completedRides: 0,
      cancelledRides: 0,
    };

    const allRides = data.rides;
    const filteredRides = filterRidesByDate(allRides, selectedMonth, selectedYear);
    
    const ongoingRides = filteredRides.filter((ride: any) => ride.status === 'start' || ride.status === 'active').length;
    const completedRides = filteredRides.filter((ride: any) => ride.status === 'completed').length;
    const cancelledRides = filteredRides.filter((ride: any) => ride.status === 'cancel').length;

    return {
      totalRides: filteredRides.length,
      ongoingRides,
      completedRides,
      cancelledRides,
    };
  };

  // Fetch real data from your API
  useEffect(() => {
    const fetchRideStats = async () => {
      setIsLoadingStats(true);
      try {
        const response = await fetch('http://localhost:9090/api/rides');
        
        if (!response.ok) {
          console.error("Failed to fetch ride stats");
          setRideStats({ totalRides: 0, ongoingRides: 0, completedRides: 0, cancelledRides: 0 });
          return;
        }
        
        const data = await response.json();
        setRidesData(data);
        
        // Calculate stats from real data
        const stats = calculateStats(data, selectedMonth, selectedYear);
        setRideStats(stats);

      } catch (error) {
        console.error("An error occurred while fetching stats:", error);
        setRideStats({ totalRides: 0, ongoingRides: 0, completedRides: 0, cancelledRides: 0 });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchRideStats();
  }, [selectedMonth, selectedYear]); 
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true); 
    try {
      const response = await fetch('/api/reports/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the selected month and year in the request body
        body: JSON.stringify({ year: selectedYear, month: selectedMonth }),
      });

      if (!response.ok) {
        console.error("Failed to generate report");
        // You could add a user-friendly error message here (e.g., using a toast notification)
        return;
      }

      // This is the magic for triggering the download
      const blob = await response.blob(); // Get the response data as a file blob
      const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob
      const a = document.createElement('a'); // Create a temporary link element
      a.href = url;
      a.download = `ride_report_${selectedYear}_${months.find(m => m.value === selectedMonth)?.name}.csv`; // Set the filename
      document.body.appendChild(a); // Add the link to the page
      a.click(); // Programmatically click the link to start the download
      a.remove(); // Clean up by removing the temporary link
      window.URL.revokeObjectURL(url); // Clean up the temporary URL

    } catch (error) {
        console.error("An error occurred while generating the report:", error);
    } finally {
        setIsGeneratingReport(false); // Hide loading text
    }
  };


  return (
    <div className="space-y-8">

      

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filter Rides</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month) => (
              <option key={month.name} value={month.value}>
                {month.name}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {getYears(2020).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RideStatsCard 
          title="Total Rides" 
          count={rideStats.totalRides} 
          isLoading={isLoadingStats}
          icon={Car}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          textColor="text-blue-600"
        />
        <RideStatsCard 
          title="Ongoing Rides" 
          count={rideStats.ongoingRides} 
          isLoading={isLoadingStats}
          icon={Activity}
          bgColor="bg-green-50"
          iconColor="text-green-600"
          textColor="text-green-600"
        />
        <RideStatsCard 
          title="Completed Rides" 
          count={rideStats.completedRides} 
          isLoading={isLoadingStats}
          icon={CheckCircle}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
          textColor="text-purple-600"
        />
        <RideStatsCard 
          title="Cancelled Rides" 
          count={rideStats.cancelledRides} 
          isLoading={isLoadingStats}
          icon={XCircle}
          bgColor="bg-red-50"
          iconColor="text-red-600"
          textColor="text-red-600"
        />
      </div>

      {/* Generate Report Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Download className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
              <p className="text-sm text-gray-600">Export ride data for {months.find(m => m.value === selectedMonth)?.name} {selectedYear}</p>
            </div>
          </div>
          <button 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingReport ? 'Generating...' : 'Download CSV'}</span>
          </button>
        </div>
      </div>

      {/* Summary Section */}
      {ridesData && !isLoadingStats && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Rides Summary</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{rideStats.totalRides}</p>
              <p className="text-sm text-gray-600">Total Rides</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{rideStats.ongoingRides}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{rideStats.completedRides}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{rideStats.cancelledRides}</p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
