"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, Clock, Mail, CheckCircle, XCircle, User } from 'lucide-react';

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

interface PassengerStatsCardProps {
  title: string;
  count: number;
  isLoading: boolean;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

const PassengerStatsCard: React.FC<PassengerStatsCardProps> = ({ 
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
    <div className="space-y-8">
      {/* Header */}
      

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PassengerStatsCard 
          title="Total Passengers" 
          count={passengers.length} 
          isLoading={isLoading}
          icon={Users}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          textColor="text-blue-600"
        />
        <PassengerStatsCard 
          title="Approved Passengers" 
          count={stats.approvedPassengers} 
          isLoading={isLoading}
          icon={UserCheck}
          bgColor="bg-green-50"
          iconColor="text-green-600"
          textColor="text-green-600"
        />
        <PassengerStatsCard 
          title="Pending Approval" 
          count={stats.pendingPassengers} 
          isLoading={isLoading}
          icon={Clock}
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
          textColor="text-yellow-600"
        />
      </div>

      {/* Pending Passengers Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Pending Passengers</h2>
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {passengers.filter(p => p.status === 'pending').length}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-gray-700 font-semibold">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>User Name</span>
                  </div>
                </th>
                <th className="text-left p-4 text-gray-700 font-semibold">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
                <th className="text-left p-4 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {passengers.filter(p => p.status === 'pending').map((passenger) => (
                <tr key={passenger.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{passenger.name}</div>
                  </td>
                  <td className="p-4 text-gray-700">{passenger.email}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      {passenger.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button 
                        className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        onClick={() => handleUpdateStatus(passenger.id, 'approved')} 
                        disabled={updatingPassengerId === passenger.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {updatingPassengerId === passenger.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button 
                        className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        onClick={() => handleUpdateStatus(passenger.id, 'rejected')} 
                        disabled={updatingPassengerId === passenger.id}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {updatingPassengerId === passenger.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {passengers.filter(p => p.status === 'pending').length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No pending passengers</p>
                    <p className="text-sm">All passengers have been processed</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved Passengers Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Approved Passengers</h2>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {passengers.filter(p => p.status === 'approved').length}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-gray-700 font-semibold">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>User Name</span>
                  </div>
                </th>
                <th className="text-left p-4 text-gray-700 font-semibold">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {passengers.filter(p => p.status === 'approved').map((passenger) => (
                <tr key={passenger.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{passenger.name}</div>
                  </td>
                  <td className="p-4 text-gray-700">{passenger.email}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {passenger.status}
                    </span>
                  </td>
                </tr>
              ))}
              {passengers.filter(p => p.status === 'approved').length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No approved passengers yet</p>
                    <p className="text-sm">Approved passengers will appear here</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}