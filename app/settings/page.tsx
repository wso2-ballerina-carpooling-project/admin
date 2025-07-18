'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [emailRecipient, setEmailRecipient] = useState('');
  const [reportFrequency, setReportFrequency] = useState('Monthly');
  const [basePrice] = useState(250); // Now non-editable
  const [showRecipients, setShowRecipients] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminFormType, setAdminFormType] = useState<'add' | 'remove'>('add');
  const [adminFormData, setAdminFormData] = useState({
    username: '',
    email: '',
    password: '',
    privileges: 'readonly' as 'readonly' | 'editable'
  });
  const [editPrivilegesData, setEditPrivilegesData] = useState({
    username: '',
    email: '',
    mode: 'readonly' as 'readonly' | 'editable'
  });

  const handleAddRecipient = () => {
    if (emailRecipient && !recipients.includes(emailRecipient)) {
      setRecipients([...recipients, emailRecipient]);
      setEmailRecipient('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleAdminFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${adminFormType} admin`, adminFormData);
    setShowAdminForm(false);
    setAdminFormData({
      username: '',
      email: '',
      password: '',
      privileges: 'readonly'
    });
  };

  const handleEditPrivilegesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated privileges for', editPrivilegesData);
    setEditPrivilegesData({
      username: '',
      email: '',
      mode: 'readonly'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-3 px-6 text-[#0d0d2b] relative">
      {/* Main Title */}
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="space-y-6 text-sm">
        {/* Authentication & Access Control */}
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-base font-semibold mb-3">🔒 Authentication & Access Control</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Allow only company email domains</span>
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-green-500" />
            </div>

            <div className="flex justify-between items-center">
              <span>Multi-role switching</span>
              <select className="border border-gray-300 rounded p-1 text-sm">
                <option>Enable</option>
                <option>Disable</option>
              </select>
            </div>

            {/* Admin Role Management */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">Admin Role Management</p>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 active:scale-95 transition text-sm"
                  onClick={() => {
                    setAdminFormType('add');
                    setShowAdminForm(true);
                  }}
                >
                  Add Admin
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 active:scale-95 transition text-sm"
                  onClick={() => {
                    setAdminFormType('remove');
                    setShowAdminForm(true);
                  }}
                >
                  Remove Admin
                </button>
              </div>
            </div>

            {/* Edit Privileges */}
            <form onSubmit={handleEditPrivilegesSubmit} className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-medium">Edit Privileges</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Username"
                    className="border border-gray-300 rounded p-1 text-sm w-32"
                    value={editPrivilegesData.username}
                    onChange={(e) => setEditPrivilegesData({
                      ...editPrivilegesData,
                      username: e.target.value
                    })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 rounded p-1 text-sm w-40"
                    value={editPrivilegesData.email}
                    onChange={(e) => setEditPrivilegesData({
                      ...editPrivilegesData,
                      email: e.target.value
                    })}
                    required
                  />
                  <select
                    className="border border-gray-300 rounded p-1 text-sm"
                    value={editPrivilegesData.mode}
                    onChange={(e) => setEditPrivilegesData({
                      ...editPrivilegesData,
                      mode: e.target.value as 'readonly' | 'editable'
                    })}
                  >
                    <option value="readonly">Read Only</option>
                    <option value="editable">Editable</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 active:scale-95 transition text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Analytics & Reporting and Payment & Fare Settings */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Analytics & Reporting */}
          <section className="bg-white rounded-xl shadow p-4 w-full md:w-1/2">
            <h2 className="text-base font-semibold mb-3">📈 Analytics & Reporting</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Auto-Report</span>
                <select className="border border-gray-300 rounded p-1 text-sm">
                  <option>Enable</option>
                  <option>Disable</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span>Frequency</span>
                <select
                  className="border border-gray-300 rounded p-1 text-sm"
                  value={reportFrequency}
                  onChange={(e) => setReportFrequency(e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span>Add Email Recipients</span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="someone@example.com"
                    className="border border-gray-300 rounded p-1 w-40 text-sm"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddRecipient()}
                  />
                  <button
                    className="bg-green-500 text-white text-sm px-2 py-1 rounded hover:bg-green-600 active:scale-95 transition"
                    onClick={handleAddRecipient}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-green-500 text-white text-sm px-3 py-1.5 rounded hover:bg-green-600 active:scale-95 transition"
                  onClick={() => setShowRecipients(!showRecipients)}
                >
                  {showRecipients ? 'Hide Recipients' : 'View Recipients'}
                </button>
              </div>

              {showRecipients && (
                <div className="mt-2 border rounded p-2 max-h-40 overflow-y-auto">
                  {recipients.length > 0 ? (
                    <ul className="space-y-1">
                      {recipients.map((email) => (
                        <li key={email} className="flex justify-between items-center">
                          <span>{email}</span>
                          <button
                            className="text-red-500 text-xs"
                            onClick={() => handleRemoveRecipient(email)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center">No recipients added</p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Payment & Fare Settings */}
          <section className="bg-white rounded-xl shadow p-4 w-full md:w-1/2">
            <h2 className="text-base font-semibold mb-3">💳 Payment & Fare Settings</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Base price per km/mile</span>
                <input
                  type="number"
                  value={basePrice}
                  readOnly
                  className="w-20 border border-gray-300 rounded p-1 bg-gray-100 text-gray-500 text-center text-sm"
                />
              </div>

              <div className="flex justify-between items-center">
                <span>Payment Methods</span>
                <button className="bg-green-500 text-white text-sm px-3 py-1.5 rounded hover:bg-green-600 active:scale-95 transition">
                  Edit
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Admin Form (inline instead of modal) */}
      {showAdminForm && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-150 flex items-center justify-center z-10 p-6">
          <div className="bg-[#0d0d2b] rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-300">
                {adminFormType === 'add' ? 'Add Admin' : 'Remove Admin'}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-200"
                onClick={() => setShowAdminForm(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAdminFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Username</label>
                <input
                  type="text"
                  className="w-full border border-gray-600 rounded p-2 bg-[#1a1a3a] text-gray-300"
                  value={adminFormData.username}
                  onChange={(e) => setAdminFormData({
                    ...adminFormData,
                    username: e.target.value
                  })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-600 rounded p-2 bg-[#1a1a3a] text-gray-300"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({
                    ...adminFormData,
                    email: e.target.value
                  })}
                  required
                />
              </div>

              {adminFormType === 'add' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-600 rounded p-2 bg-[#1a1a3a] text-gray-300"
                      value={adminFormData.password}
                      onChange={(e) => setAdminFormData({
                        ...adminFormData,
                        password: e.target.value
                      })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Privileges</label>
                    <select
                      className="w-full border border-gray-600 rounded p-2 bg-[#1a1a3a] text-gray-300"
                      value={adminFormData.privileges}
                      onChange={(e) => setAdminFormData({
                        ...adminFormData,
                        privileges: e.target.value as 'readonly' | 'editable'
                      })}
                    >
                      <option value="readonly" className="bg-[#1a1a3a]">Read Only</option>
                      <option value="editable" className="bg-[#1a1a3a]">Editable</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800 text-gray-300"
                  onClick={() => setShowAdminForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${
                    adminFormType === 'add'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {adminFormType === 'add' ? 'Add Admin' : 'Remove Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}