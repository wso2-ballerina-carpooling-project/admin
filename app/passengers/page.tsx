"use client";

import React, { useState } from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

const PassengersPage = () => {
  const [approvedPassengers, setApprovedPassengers] = useState(192);
  const [pendingPassengers, setPendingPassengers] = useState(15);

  const [passengers, setPassengers] = useState([
    { name: 'Leigh Cummerata', email: 'leigh.cummerata@email.com',  status: 'pending' },
    { name: 'Edmond Rogahn', email: 'edmond.rogahn@email.com', status: 'pending' },
    { name: 'Noel Maglie', email: 'noel.maglie@email.com', status: 'pending' },
    { name: 'Ms. Bryan Bayer', email: 'bryan.bayer@email.com', status: 'pending' },
    { name: 'Greg Spencer', email: 'greg.spencer@email.com', status: 'pending' },
    { name: 'Erik Kling', email: 'erik.kling@email.com', status: 'pending' },
    { name: 'Noah Fadel', email: 'noah.fadel@email.com', status: 'pending' },
    { name: 'Faith Harris', email: 'faith.harris@email.com', status: 'pending' },
    { name: 'Anthony Ranke', email: 'anthony.ranke@email.com', status: 'pending' },
    { name: 'Harriet Hintz', email: 'harriet.hintz@email.com', status: 'pending' },
  ]);

  const handleApprove = (index: number) => {
    const updatedPassengers = [...passengers];
    if (updatedPassengers[index].status === 'pending') {
      updatedPassengers[index].status = 'approved';
      setPassengers(updatedPassengers);
      setApprovedPassengers(approvedPassengers + 1);
      setPendingPassengers(pendingPassengers - 1);
      console.log(`Approved: ${passengers[index].name}`);
    }
  };

  const handleReject = (index: number) => {
    const updatedPassengers = [...passengers];
    if (updatedPassengers[index].status === 'pending') {
      updatedPassengers[index].status = 'rejected';
      setPassengers(updatedPassengers);
      setPendingPassengers(pendingPassengers - 1);
      console.log(`Rejected: ${passengers[index].name}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Approved and Pending Cards */}
      <div className="flex space-x-6 mb-6">
        {/* Approved Card */}
        <div className="bg-green-100 text-green-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
          <div className="flex left-end items-center space-x-5">
            <FaCheckCircle className="text-green-600 text-3xl" />
            <p className="font-semibold text-right">Approved Passengers</p>
          </div>
          <div className="text-center mt-6">
            <span className="text-5xl font-bold">{approvedPassengers}</span>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
          <div className="flex left-end items-center space-x-7">
            <FaClock className="text-yellow-600 text-3xl" />
            <p className="font-semibold text-right">Pending Passengers</p>
          </div>
          <div className="text-center mt-6">
            <span className="text-5xl font-bold">{pendingPassengers}</span>
          </div>
        </div>
      </div>

      {/* Passenger Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-gray-700 font-semibold">User Name</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Company Email</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Status</th>
              <th className="text-left py-2 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((passenger, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {/* Placeholder for profile image */}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{passenger.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2 text-gray-700">{passenger.email}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    passenger.status === 'approved' ? 'bg-green-200 text-green-800' :
                    passenger.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {passenger.status}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleApprove(index)}
                      disabled={passenger.status !== 'pending'}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleReject(index)}
                      disabled={passenger.status !== 'pending'}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PassengersPage;


