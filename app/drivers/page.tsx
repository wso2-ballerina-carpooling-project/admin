"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

// --- STEP 1: DEFINE TYPESCRIPT TYPES TO MATCH YOUR BACKEND DATA ---
// This provides type safety and autocompletion.
type Driver = {
  id: string;
  name: string;
  vehicle: string;
  registeredDate: string; // Assuming it's a string timestamp for now
  status: 'approved' | 'pending' | 'rejected';
  licenseUrl: string;
  registrationUrl: string;
  // NOTE: The 'email' field is not provided by your backend `getDrivers` function.
  // We will add it back if needed, but for now, we'll use the fields from the API.
};

type DriverStats = {
  approvedDrivers: number;
  pendingDrivers: number;
  rejectedDrivers: number;
};

// --- The Main Drivers Page Component (Now Fully Integrated) ---
export default function DriversPage() {
  // --- STEP 2: REFACTOR STATE TO BE DYNAMIC ---
  // We'll initialize our state as empty and let the backend populate it.
  const [stats, setStats] = useState<DriverStats>({ approvedDrivers: 0, pendingDrivers: 0, rejectedDrivers: 0 });
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  // State for loading and error handling for a better user experience.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State to track which specific button is being clicked.
  const [updatingDriverId, setUpdatingDriverId] = useState<string | null>(null);

  // --- STEP 3: FETCH LIVE DATA FROM THE BACKEND ---
  // We wrap this in useCallback to ensure the function reference is stable.
  const fetchData = useCallback(async () => {
    try {
      // <<--- BACKEND INTEGRATION (GET) --- >>
      // This fetch call talks to the GET /api/drivers endpoint.
      // The Next.js proxy forwards this to http://localhost:9090/api/drivers.
      const response = await fetch('/api/drivers');
      if (!response.ok) {
        throw new Error("Failed to fetch driver data from the server.");
      }
      const data = await response.json();

      // Update the UI by setting the state with the data from Ballerina.
      setDrivers(data.drivers);
      setStats(data.stats);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("An error occurred while fetching drivers:", err);
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop the main page loading indicator
    }
  }, []);

  // Use useEffect to call fetchData() once when the component first loads.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- STEP 4: MAKE THE ACTION BUTTONS FUNCTIONAL ---

  const handleUpdateStatus = async (driverId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingDriverId(driverId); // Show loading state on the specific button
    try {
      // <<--- BACKEND INTEGRATION (POST) --- >>
      // This fetch call talks to the POST /api/drivers/approve or /api/drivers/reject endpoints.
      const response = await fetch(`/api/drivers/${newStatus}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driverId }), // Send the driverId in the body as the backend expects.
      });

      if (!response.ok) {
        throw new Error(`Failed to update driver status to ${newStatus}.`);
      }

      // After a successful update, refetch all data to ensure the UI is perfectly in sync with the backend.
      // This is more reliable than trying to manipulate the local state manually.
      await fetchData();

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setUpdatingDriverId(null); // Hide loading state on the button
    }
  };

  // NOTE: There is no backend endpoint for deleting a driver.
  // The handleDelete function has been removed to accurately reflect backend capabilities.

  // --- Render logic for loading and error states ---
  if (isLoading) {
    return <div className="text-center p-8">Loading driver data...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Stat Cards - Now populated from the 'stats' state */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
            <div className="flex justify-between items-center">
                <FaCheckCircle className="text-green-600 text-3xl" />
                <p className="font-semibold text-right">Approved</p>
            </div>
            <div className="text-center mt-6">
                <span className="text-5xl font-bold">{stats.approvedDrivers}</span>
            </div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
            <div className="flex justify-between items-center">
                <FaClock className="text-yellow-600 text-3xl" />
                <p className="font-semibold text-right">Pending</p>
            </div>
            <div className="text-center mt-6">
                <span className="text-5xl font-bold">{stats.pendingDrivers}</span>
            </div>
        </div>
        {/* You can add a card for rejected drivers too if you like */}
        {/* <div className="bg-red-100 ...">{stats.rejectedDrivers}</div> */}
      </div>

      {/* Pending Drivers Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Pending Driver Applications</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-gray-700 font-semibold">User Name</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Vehicle</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Documents</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers
              .filter(driver => driver.status === 'pending')
              .map((driver) => (
                <tr key={driver.id} className="border-b">
                  <td className="py-2 font-medium text-gray-700">{driver.name}</td>
                  <td className="py-2 text-gray-700">{driver.vehicle}</td>
                  <td className="py-2 text-sm">
                    <a href={driver.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">License</a> | <a href={driver.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Registration</a>
                  </td>
                  <td className="py-2">
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        onClick={() => handleUpdateStatus(driver.id, 'approved')}
                        disabled={updatingDriverId === driver.id}
                      >
                        {updatingDriverId === driver.id ? '...' : 'Approve'}
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        onClick={() => handleUpdateStatus(driver.id, 'rejected')}
                        disabled={updatingDriverId === driver.id}
                      >
                        {updatingDriverId === driver.id ? '...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Approved Drivers Table (and other statuses) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">All Registered Drivers</h2>
        {/* You can create a similar table here to show approved/rejected drivers if you wish */}
      </div>
    </div>
  );
};