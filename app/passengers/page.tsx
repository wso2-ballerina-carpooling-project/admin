"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

// --- Types defined to match the backend data ---
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

// --- The Main Passengers Page Component ---
export default function PassengersPage() {
  // --- State variables for dynamic data ---
  const [stats, setStats] = useState<PassengerStats>({ approvedPassengers: 0, pendingPassengers: 0 });
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingPassengerId, setUpdatingPassengerId] = useState<string | null>(null);

  // --- Function to fetch data from the backend ---
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/passengers');
      if (!response.ok) {
        throw new Error("Failed to fetch passenger data from the server.");
      }
      const data = await response.json();
      setPassengers(data.passengers);
      setStats(data.stats);
      setError(null);
    } catch (err: any) {
      console.error("An error occurred while fetching passengers:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect hook to call fetchData once on load.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Function to handle button clicks and update status ---
  const handleUpdateStatus = async (passengerId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingPassengerId(passengerId);
    try {
      const response = await fetch(`/api/passengers/${newStatus}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passengerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update passenger status to ${newStatus}.`);
      }
      await fetchData();

    } catch (err: any) {
      // *** THIS IS THE CORRECTED BLOCK ***
      // The error was that this 'catch' block was missing its curly braces {}.
      console.error(err);
      setError(err.message);
    } finally {
      setUpdatingPassengerId(null);
    }
  };

  // --- Render logic for loading and error states ---
  if (isLoading) {
    return <div className="text-center p-8">Loading passenger data...</div>;
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
                <span className="text-5xl font-bold">{stats.approvedPassengers}</span>
            </div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
            <div className="flex justify-between items-center">
                <FaClock className="text-yellow-600 text-3xl" />
                <p className="font-semibold text-right">Pending</p>
            </div>
            <div className="text-center mt-6">
                <span className="text-5xl font-bold">{stats.pendingPassengers}</span>
            </div>
        </div>
      </div>

      {/* Pending Passengers Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Pending Passengers</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-gray-700 font-semibold">User Name</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Email</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Status</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {passengers
              .filter(passenger => passenger.status === 'pending')
              .map((passenger) => (
                <tr key={passenger.id} className="border-b">
                  <td className="py-2 font-medium text-gray-700">{passenger.name}</td>
                  <td className="py-2 text-gray-700">{passenger.email}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-200 text-yellow-800">
                      {passenger.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        onClick={() => handleUpdateStatus(passenger.id, 'approved')}
                        disabled={updatingPassengerId === passenger.id}
                      >
                        {updatingPassengerId === passenger.id ? '...' : 'Approve'}
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        onClick={() => handleUpdateStatus(passenger.id, 'rejected')}
                        disabled={updatingPassengerId === passenger.id}
                      >
                        {updatingPassengerId === passenger.id ? '...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Approved Passengers Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Approved Passengers</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-gray-700 font-semibold">User Name</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Email</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {passengers
              .filter(passenger => passenger.status === 'approved')
              .map((passenger) => (
                <tr key={passenger.id} className="border-b">
                  <td className="py-2 font-medium text-gray-700">{passenger.name}</td>
                  <td className="py-2 text-gray-700">{passenger.email}</td>
                  <td className="py-2">
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
  );
};
