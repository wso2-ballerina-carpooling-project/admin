'use client';

import React, { useState, useEffect } from 'react';

// --- Helper constants and functions (no changes here) ---
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
  return years.reverse(); // Show most recent year first
};

const RideStatsCard = ({ title, count, isLoading }: { title: string; count: number; isLoading: boolean; }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center w-64 flex-grow">
    <h3 className="text-lg font-semibold text-[#0d0d2b]">{title}</h3>
    {/* Show a loading indicator while fetching data */}
    <p className="text-4xl font-bold text-[#0d0d2b] mt-2">
      {isLoading ? '...' : count.toString().padStart(2, '0')}
    </p>
  </div>
);

// --- The main page component with all the new logic ---
export default function RidesPage() {
  // State for the filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month (1-12)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State to hold the statistics from the API
  const [rideStats, setRideStats] = useState({
    scheduledRides: 0,
    ongoingRides: 0,
    completedRides: 0,
    cancelledRides: 0,
  });

  // State to manage loading indicators for a better user experience
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // --- NEW: useEffect hook to fetch data when filters change ---
  useEffect(() => {
    const fetchRideStats = async () => {
      setIsLoadingStats(true); // Show loading indicator on cards
      try {
        // Construct the URL with query parameters from the state
        const response = await fetch(`/api/rides/admin?year=${selectedYear}&month=${selectedMonth}`);
        
        if (!response.ok) {
          // Handle server errors (like 500)
          console.error("Failed to fetch ride stats");
          setRideStats({ scheduledRides: 0, ongoingRides: 0, completedRides: 0, cancelledRides: 0 });
          return;
        }
        
        const data = await response.json();
        // Update the state with the data from the Ballerina API
        setRideStats(data);

      } catch (error) {
        console.error("An error occurred while fetching stats:", error);
      } finally {
        setIsLoadingStats(false); // Hide loading indicator
      }
    };

    fetchRideStats();
  }, [selectedMonth, selectedYear]); // This dependency array is crucial: the effect re-runs whenever month or year changes

  // --- NEW: Function to handle the "Generate Report" button click ---
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true); // Show loading text on the button
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#0d0d2b]">Filter Rides</h1>

      {/* Filters (now controlled by state) */}
      <div className="flex flex-wrap gap-4 mb-10">
        <select
          className="p-2 rounded bg-white border border-gray-300 shadow text-[#0d0d2b]"
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
          className="p-2 rounded bg-white border border-gray-300 shadow text-[#0d0d2b]"
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

      {/* Stats Cards (now display data from the API) */}
      <div className="flex flex-wrap justify-start gap-6 mb-10">
        <RideStatsCard title="Scheduled Rides" count={rideStats.scheduledRides} isLoading={isLoadingStats} />
        <RideStatsCard title="Ongoing Rides" count={rideStats.ongoingRides} isLoading={isLoadingStats} />
        <RideStatsCard title="Completed Rides" count={rideStats.completedRides} isLoading={isLoadingStats} />
        <RideStatsCard title="Cancelled Rides" count={rideStats.cancelledRides} isLoading={isLoadingStats} />
      </div>

      {/* Generate Report Button (now calls the handler function) */}
      <div className="flex justify-center">
        <button 
          className="bg-[#0d0d2b] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1b1b3b] transition disabled:opacity-50"
          onClick={handleGenerateReport}
          disabled={isGeneratingReport} // Disable button while report is being generated
        >
          {isGeneratingReport ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
}
