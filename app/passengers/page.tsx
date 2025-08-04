"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

// --- CHANGE #1: SIMPLIFY THE TYPE DEFINITION ---
// Removed registeredDate as it is no longer displayed.
type Passenger = {
  id: string;
  name: string;
  email: string;
  status: 'approved' | 'pending' | 'rejected';
  
};

type PassengerStats = {
  approvedPassengers: number;
  pendingPassengers: number;
};

export default function PassengersPage() {
  const [stats, setStats] = useState<PassengerStats>({ approvedPassengers: 0, pendingPassengers: 0 });
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingPassengerId, setUpdatingPassengerId] = useState<string | null>(null);

  // Fetching logic remains the same.
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/passengers');
      if (!response.ok) { throw new Error("Failed to fetch passenger data."); }
      const data = await response.json();
      setPassengers(data.passengers);
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

  // Status update logic remains the same.
  const handleUpdateStatus = async (passengerId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingPassengerId(passengerId);
    let apiPath = newStatus === 'approved' ? '/api/passengers/approve' : '/api/passengers/reject';
    try {
      await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passengerId }),
      });
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingPassengerId(null);
    }
  };

  if (isLoading) { return <div className="text-center p-8">Loading passenger data...</div>; }
  if (error) { return <div className="text-center text-red-500 p-8">Error: {error}</div>; }

  return (
    <div className="container mx-auto p-4">
      {/* Stat Cards remain the same */}
      <div className="flex flex-wrap gap-6 mb-6">
          <div className="bg-green-100 text-green-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
              <div className="flex justify-between items-center"><FaCheckCircle className="text-green-600 text-3xl" /><p className="font-semibold text-right">Approved</p></div>
              <div className="text-center mt-6"><span className="text-5xl font-bold">{stats.approvedPassengers}</span></div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
              <div className="flex justify-between items-center"><FaClock className="text-yellow-600 text-3xl" /><p className="font-semibold text-right">Pending</p></div>
              <div className="text-center mt-6"><span className="text-5xl font-bold">{stats.pendingPassengers}</span></div>
          </div>
      </div>

      {/* Pending Passengers Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Pending Passengers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-gray-700 font-semibold">User Name</th>
                <th className="text-left p-3 text-gray-700 font-semibold">Email</th>
                <th className="text-left p-3 text-gray-700 font-semibold">Status</th>
                {/* --- CHANGE #2: REMOVED "REGISTERED ON" HEADER --- */}
                <th className="text-left p-3 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passengers.filter(p => p.status === 'pending').map((passenger) => (
                <tr key={passenger.id} className="border-b">
                  <td className="p-3 font-medium text-gray-700">{passenger.name}</td>
                  <td className="p-3 text-gray-700">{passenger.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-200 text-yellow-800">
                      {passenger.status}
                    </span>
                  </td>
                  {/* --- CHANGE #3: REMOVED "REGISTERED ON" CELL --- */}
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50" onClick={() => handleUpdateStatus(passenger.id, 'approved')} disabled={updatingPassengerId === passenger.id}>
                        {updatingPassengerId === passenger.id ? '...' : 'Approve'}
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50" onClick={() => handleUpdateStatus(passenger.id, 'rejected')} disabled={updatingPassengerId === passenger.id}>
                        {updatingPassengerId === passenger.id ? '...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved Passengers Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Approved Passengers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-gray-700 font-semibold">User Name</th>
                <th className="text-left p-3 text-gray-700 font-semibold">Email</th>
                {/* --- CHANGE #2: REMOVED "REGISTERED ON" HEADER --- */}
                <th className="text-left p-3 text-gray-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {passengers.filter(p => p.status === 'approved').map((passenger) => (
                <tr key={passenger.id} className="border-b">
                  <td className="p-3 font-medium text-gray-700">{passenger.name}</td>
                  <td className="p-3 text-gray-700">{passenger.email}</td>
                  {/* --- CHANGE #3: REMOVED "REGISTERED ON" CELL --- */}
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-200 text-green-800">
                      {passenger.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}