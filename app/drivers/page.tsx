"use client";

import React, { useState } from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

const DriversPage = () => {
  const [approvedDrivers, setApprovedDrivers] = useState(52);
  const [pendingDrivers, setPendingDrivers] = useState(15);

  const [drivers, setDrivers] = useState([
    { name: 'Leigh Cummerata', email: 'leigh.cummerata@email.com', status: 'pending' },
    { name: 'Edmond Rogahn', email: 'edmond.rogahn@email.com', status: 'pending' },
    { name: 'Noel Maggio', email: 'noel.maggio@email.com', status: 'pending' },
    { name: 'Ms. Bryant Bayer', email: 'bryant.bayer@email.com', status: 'pending' },
    { name: 'Greg Spencer', email: 'greg.spencer@email.com', status: 'pending' },
    { name: 'Erik Kling', email: 'erik.kling@email.com', status: 'pending' },
    { name: 'Noah Fadel', email: 'noah.fadel@email.com', status: 'pending' },
    { name: 'Faith Harris', email: 'faith.harris@email.com', status: 'pending' },
    { name: 'Anthony Ratke', email: 'anthony.ratke@email.com', status: 'pending' },
    { name: 'Harriet Hintz', email: 'harriet.hintz@email.com', status: 'pending' },
  ]);

  const handleApprove = (index: number) => {
    const updatedDrivers = [...drivers];
    if (updatedDrivers[index].status === 'pending') {
      updatedDrivers[index].status = 'approved';
      setDrivers(updatedDrivers);
      setApprovedDrivers(approvedDrivers + 1);
      setPendingDrivers(pendingDrivers - 1);
      console.log(`Approved: ${drivers[index].name}`);
    }
  };

  const handleReject = (index: number) => {
    const updatedDrivers = [...drivers];
    if (updatedDrivers[index].status === 'pending') {
      updatedDrivers[index].status = 'rejected';
      setDrivers(updatedDrivers);
      setPendingDrivers(pendingDrivers - 1);
      console.log(`Rejected: ${drivers[index].name}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Approved and Pending Cards */}
      <div className="flex space-x-6 mb-6">
        {/* Approved Card */}
        <div className="bg-green-100 text-green-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
          <div className="flex left-end items-center space-x-10">
            <FaCheckCircle className="text-green-600 text-3xl" />
            <p className="font-semibold text-right">Approved Drivers</p>
          </div>
          <div className="text-center mt-6">
            <span className="text-5xl font-bold">{approvedDrivers}</span>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg w-64 flex flex-col justify-between shadow">
          <div className="flex left-end items-center space-x-14">
            <FaClock className="text-yellow-600 text-3xl" />
            <p className="font-semibold text-right">Pending Drivers</p>
          </div>
          <div className="text-center mt-6">
            <span className="text-5xl font-bold">{pendingDrivers}</span>
          </div>
        </div>
      </div>

      {/* Driver Table */}
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
            {drivers.map((driver, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {/* Placeholder for profile image */}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{driver.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2 text-gray-700">{driver.email}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    driver.status === 'approved' ? 'bg-green-200 text-green-800' :
                    driver.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {driver.status}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleApprove(index)}
                      disabled={driver.status !== 'pending'}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleReject(index)}
                      disabled={driver.status !== 'pending'}
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

export default DriversPage;