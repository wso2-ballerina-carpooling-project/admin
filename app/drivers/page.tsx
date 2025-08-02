"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';



type Driver = {
  
  id: string;
  name: string;
  vehicle: string;
  registeredDate: string;
  status: 'approved' | 'pending' | 'rejected';
  licenseUrl: string;
  registrationUrl: string;

};

type DriverStats = {
  approvedDrivers: number;
  pendingDrivers: number;
  rejectedDrivers: number;
};


export default function DriversPage() {

  const [stats, setStats] = useState<DriverStats>({ approvedDrivers: 0, pendingDrivers: 0, rejectedDrivers: 0 });
  const [drivers, setDrivers] = useState<Driver[]>([]);


  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  

  const [updatingDriverId, setUpdatingDriverId] = useState<string | null>(null);


  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {

      const response = await fetch('/api/drivers');
      if (!response.ok) {
        throw new Error("Failed to fetch driver data.");
      }
      const data = await response.json();


      setDrivers(data.drivers);
      setStats(data.stats);
      setError(null);
    } catch (err: any) {

      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleUpdateStatus = async (driverId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingDriverId(driverId);
    
    // Explicitly define the API path based on the action.
    let apiPath = '';
    if (newStatus === 'approved') {
      apiPath = '/api/drivers/approve';
    } else if (newStatus === 'rejected') {
      apiPath = '/api/drivers/reject';
    } else {
      console.error("Invalid status provided:", newStatus);
      setUpdatingDriverId(null);
      return; // Exit the function if status is invalid
    }

    try {
      // Use the precise apiPath variable in the fetch call.
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status. Server responded with ${response.status}`);
      }
      
      await fetchData(); // Refetch data to show the change
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setUpdatingDriverId(null);
    }
  };



  if (isLoading) {
    return <div className="text-center p-8">Loading driver data...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Stat Cards */}
      <div className="flex flex-wrap gap-6 mb-6">
          <div className="bg-green-100 text-green-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
              <div className="flex justify-between items-center"><FaCheckCircle className="text-green-600 text-3xl" /><p className="font-semibold text-right">Approved</p></div>
              <div className="text-center mt-6"><span className="text-5xl font-bold">{stats.approvedDrivers}</span></div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
              <div className="flex justify-between items-center"><FaClock className="text-yellow-600 text-3xl" /><p className="font-semibold text-right">Pending</p></div>
              <div className="text-center mt-6"><span className="text-5xl font-bold">{stats.pendingDrivers}</span></div>
          </div>
      </div>

      {/* Pending Drivers Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Pending Driver Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-gray-700 font-semibold">User Name</th>
                <th className="text-left p-3 text-gray-700 font-semibold">Vehicle</th>
                <th className="text-left p-3 text-gray-700 font-semibold">Registered On</th>
                <th className="text-left p-3 text-gray-700 font-semibold">Documents</th>
                <th className="text-left p-3 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers
                .filter(driver => driver.status === 'pending')
                .map((driver) => (
                  <tr key={driver.id} className="border-b">
                    <td className="p-3 font-medium text-gray-700">{driver.name}</td>
                    <td className="p-3 text-gray-700">{driver.vehicle}</td>
                    <td className="p-3 text-gray-700">{driver.registeredDate}</td>
                    <td className="p-3 text-sm">
                      <a href={driver.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">License</a> | <a href={driver.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Registration</a>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                          onClick={() => handleUpdateStatus(driver.id, 'approved')}
                          disabled={updatingDriverId === driver.id}>
                          {updatingDriverId === driver.id ? '...' : 'Approve'}
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                          onClick={() => handleUpdateStatus(driver.id, 'rejected')}
                          disabled={updatingDriverId === driver.id}>
                          {updatingDriverId === driver.id ? '...' : 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}``