'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity, 
  Car, 
  Users, 
  UserCheck, 
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  MapPin
} from 'lucide-react';

// Chart components (using simple CSS-based charts)
interface ChartData {
  label: string;
  value: number;
  color: string;
}

const BarChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-sm text-gray-600">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div 
                className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color 
                }}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChartComponent: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center space-x-8">
        <div className="relative w-32 h-32">
          {/* Simple pie chart representation */}
          <div className="w-32 h-32 rounded-full bg-gray-200 relative overflow-hidden">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const prevPercentages = data.slice(0, index).reduce((sum, prevItem) => 
                sum + (prevItem.value / total) * 100, 0
              );
              
              return (
                <div 
                  key={index}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${prevPercentages * 3.6}deg, ${item.color} 0deg, ${item.color} ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LineChart: React.FC<{ data: { month: string; value: number }[]; title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg relative"
              style={{ height: `${(item.value / maxValue) * 200}px` }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                {item.value}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 text-center">{item.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  bgColor, 
  iconColor 
}) => (
  <div className={`${bgColor} rounded-xl p-6 border border-gray-100`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${bgColor} ring-2 ring-white`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div className={`flex items-center space-x-1 text-sm font-medium ${
        changeType === 'increase' ? 'text-green-600' : 
        changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {changeType === 'increase' && <ArrowUp className="w-4 h-4" />}
        {changeType === 'decrease' && <ArrowDown className="w-4 h-4" />}
        <span>{change}</span>
      </div>
    </div>
  </div>
);

export default function AnalyticsPage() {
  const [systemData, setSystemData] = useState({
    totalRides: 0,
    totalUsers: 0,
    totalDrivers: 0,
    totalRevenue: 0,
    activeRides: 0,
    completedRides: 0,
    cancelledRides: 0,
    approvedDrivers: 0,
    pendingDrivers: 0,
    approvedPassengers: 0,
    pendingPassengers: 0,
    paidPayments: 0,
    pendingPayments: 0
  });
  
  const [ridesData, setRidesData] = useState<any>(null);
  const [usersData, setUsersData] = useState<any>(null);
  const [paymentsData, setPaymentsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  // Fetch all system data
  useEffect(() => {
    const fetchSystemData = async () => {
      setIsLoading(true);
      try {
        // Fetch rides data
        const ridesResponse = await fetch('http://localhost:9090/api/rides');
        const ridesData = ridesResponse.ok ? await ridesResponse.json() : { rides: [] };
        
        // Fetch users data
        const usersResponse = await fetch('http://localhost:9090/api/users');
        const usersData = usersResponse.ok ? await usersResponse.json() : { users: [] };
        
        // Fetch payments data
        const paymentsResponse = await fetch('http://localhost:9090/api/payments');
        const paymentsData = paymentsResponse.ok ? await paymentsResponse.json() : { payment: [] };

        setRidesData(ridesData);
        setUsersData(usersData);
        setPaymentsData(paymentsData);

        // Calculate analytics
        const rides = ridesData.rides || [];
        const users = usersData.users || [];
        const payments = paymentsData.payment || [];

        const activeRides = rides.filter((r: any) => r.status === 'start' || r.status === 'active').length;
        const completedRides = rides.filter((r: any) => r.status === 'completed').length;
        const cancelledRides = rides.filter((r: any) => r.status === 'cancel').length;

        // Calculate total revenue in LKR
        const totalRevenue = payments.reduce((sum: number, payment: any) => {
          const amount = parseFloat(payment.amount) || 0;
          return sum + amount;
        }, 0);

        // Calculate payment statistics
        const paidPayments = paymentsData.payeed || 0;
        const pendingPayments = paymentsData.notpayeed || 0;

        // Simulate driver and passenger data (replace with real API calls when available)
        const approvedDrivers = usersData.drivers || Math.floor(users.length * 0.3);
        const pendingDrivers = Math.floor(users.length * 0.1);
        const approvedPassengers = usersData.passengers || Math.floor(users.length * 0.6);
        const pendingPassengers = Math.floor(users.length * 0.05);

        setSystemData({
          totalRides: rides.length,
          totalUsers: users.length,
          totalDrivers: approvedDrivers + pendingDrivers,
          totalRevenue,
          activeRides,
          completedRides,
          cancelledRides,
          approvedDrivers,
          pendingDrivers,
          approvedPassengers,
          pendingPassengers,
          paidPayments,
          pendingPayments
        });

      } catch (error) {
        console.error('Error fetching system data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemData();
  }, [selectedPeriod]);

  // Chart data
  const rideStatusData: ChartData[] = [
    { label: 'Active', value: systemData.activeRides, color: '#10B981' },
    { label: 'Completed', value: systemData.completedRides, color: '#3B82F6' },
    { label: 'Cancelled', value: systemData.cancelledRides, color: '#EF4444' }
  ];

  const userTypeData: ChartData[] = [
    { label: 'Drivers', value: systemData.totalDrivers, color: '#8B5CF6' },
    { label: 'Passengers', value: systemData.approvedPassengers, color: '#06B6D4' }
  ];

  const paymentStatusData: ChartData[] = [
    { label: 'Paid', value: systemData.paidPayments, color: '#10B981' },
    { label: 'Pending', value: systemData.pendingPayments, color: '#F59E0B' }
  ];

  const monthlyRidesData = [
    { month: 'Jan', value: Math.floor(systemData.totalRides * 0.15) },
    { month: 'Feb', value: Math.floor(systemData.totalRides * 0.12) },
    { month: 'Mar', value: Math.floor(systemData.totalRides * 0.18) },
    { month: 'Apr', value: Math.floor(systemData.totalRides * 0.14) },
    { month: 'May', value: Math.floor(systemData.totalRides * 0.16) },
    { month: 'Jun', value: Math.floor(systemData.totalRides * 0.13) },
    { month: 'Jul', value: Math.floor(systemData.totalRides * 0.12) }
  ];

  const revenueData: ChartData[] = [
    { label: 'Q1', value: Math.floor(systemData.totalRevenue * 0.25), color: '#F59E0B' },
    { label: 'Q2', value: Math.floor(systemData.totalRevenue * 0.30), color: '#EF4444' },
    { label: 'Q3', value: Math.floor(systemData.totalRevenue * 0.28), color: '#10B981' },
    { label: 'Q4', value: Math.floor(systemData.totalRevenue * 0.17), color: '#3B82F6' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
    

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Rides"
          value={systemData.totalRides.toString()}
          change="+12%"
          changeType="increase"
          icon={Car}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <AnalyticsCard
          title="Active Users"
          value={systemData.totalUsers.toString()}
          change="+8%"
          changeType="increase"
          icon={Users}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`Rs ${systemData.totalRevenue.toLocaleString()}`}
          change="+15%"
          changeType="increase"
          icon={DollarSign}
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
        />
        <AnalyticsCard
          title="Active Rides"
          value={systemData.activeRides.toString()}
          change="-2%"
          changeType="decrease"
          icon={Activity}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          data={rideStatusData} 
          title="Rides by Status" 
        />
        <PieChartComponent 
          data={userTypeData} 
          title="User Distribution" 
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={monthlyRidesData} 
          title="Monthly Ride Trends" 
        />
        <BarChart 
          data={revenueData} 
          title="Quarterly Revenue (LKR)" 
        />
      </div>

      {/* Payment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent 
          data={paymentStatusData} 
          title="Payment Status Distribution" 
        />
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Activity className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {ridesData?.rides?.slice(0, 5).map((ride: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {ride.startLocation} → {ride.endLocation}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(ride.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                  ride.status === 'active' || ride.status === 'start' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ride.status}
                </span>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-4">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Statistics */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Driver Analytics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved Drivers</span>
              <span className="font-semibold text-emerald-600">{systemData.approvedDrivers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Applications</span>
              <span className="font-semibold text-yellow-600">{systemData.pendingDrivers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approval Rate</span>
              <span className="font-semibold text-blue-600">
                {systemData.totalDrivers > 0 ? Math.round((systemData.approvedDrivers / systemData.totalDrivers) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Passenger Statistics */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Passenger Analytics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved Passengers</span>
              <span className="font-semibold text-green-600">{systemData.approvedPassengers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Approval</span>
              <span className="font-semibold text-yellow-600">{systemData.pendingPassengers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Rate</span>
              <span className="font-semibold text-blue-600">
                {systemData.totalUsers > 0 ? Math.round((systemData.approvedPassengers / systemData.totalUsers) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">System Performance Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {systemData.totalRides > 0 ? Math.round((systemData.completedRides / systemData.totalRides) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Ride Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {systemData.totalRides > 0 ? Math.round(((systemData.totalRides - systemData.cancelledRides) / systemData.totalRides) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              Rs {systemData.totalRides > 0 ? Math.round(systemData.totalRevenue / systemData.totalRides) : 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Average Revenue per Ride</div>
          </div>
        </div>
      </div>
    </div>
  );
}
