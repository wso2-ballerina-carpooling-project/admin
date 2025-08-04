
'use client';
import React from 'react';
import StatCard from '@/components/StatCard';
import PaymentCharts from '@/components/PaymentCharts';
import { 
  Car, 
  X, 
  User, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Clock, 
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3
} from 'lucide-react';

interface RidesData {
  rides: any[];
  count?: number;
}

interface UsersData {
  users: any[];
  count: number;
  drivers: number;
  passengers: number;
}

interface PaymentsData {
  payment: any[];
  count: number;
  payeed: number;
  notpayeed: number;
}

const DashboardPage = () => {
  const [ridesData, setRidesData] = React.useState<RidesData | null>(null);
  const [usersData, setUsersData] = React.useState<UsersData | null>(null);
  const [paymentsData, setPaymentsData] = React.useState<PaymentsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch rides, users, and payments data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rides data
        const ridesResponse = await fetch('http://localhost:9090/api/rides');
        const ridesData = await ridesResponse.json();
        setRidesData(ridesData);

        // Fetch users data
        const usersResponse = await fetch('http://localhost:9090/api/users');
        const usersData = await usersResponse.json();
        setUsersData(usersData);

        // Fetch payments data
        const paymentsResponse = await fetch('http://localhost:9090/api/payments');
        const paymentsData = await paymentsResponse.json();
        setPaymentsData(paymentsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics from real data
  const getStatsFromData = (data: any) => {
    if (!data || !data.rides) return {
      totalRides: 0,
      completedRides: 0,
      activeRides: 0,
      cancelledRides: 0,
      totalRevenue: 0
    };

    const rides = data.rides;
    const completedRides = rides.filter((ride: any) => ride.status === 'completed').length;
    const activeRides = rides.filter((ride: any) => ride.status === 'active' || ride.status === 'start').length;
    const cancelledRides = rides.filter((ride: any) => ride.status === 'cancel').length;
    
    // Calculate total revenue from completed rides
    const totalRevenue = rides
      .filter((ride: any) => ride.status === 'completed')
      .reduce((sum: number, ride: any) => {
        const rideRevenue = ride.passengers?.reduce((passengerSum: number, passenger: any) => {
          return passengerSum + (parseFloat(passenger.cost) || 0);
        }, 0) || 0;
        return sum + rideRevenue;
      }, 0);

    return {
      totalRides: rides.length,
      completedRides,
      activeRides,
      cancelledRides,
      totalRevenue: Math.round(totalRevenue)
    };
  };

  // Calculate payment statistics
  const getPaymentStats = () => {
    if (!paymentsData) return {
      totalPayments: 0,
      paidPayments: 0,
      pendingPayments: 0,
      totalAmountPaid: 0,
      totalAmountPending: 0
    };

    const totalAmountPaid = paymentsData.payment
      .filter((payment: any) => payment.isPaid)
      .reduce((sum: number, payment: any) => sum + (parseFloat(payment.amount) || 0), 0);

    const totalAmountPending = paymentsData.payment
      .filter((payment: any) => !payment.isPaid)
      .reduce((sum: number, payment: any) => sum + (parseFloat(payment.amount) || 0), 0);

    return {
      totalPayments: paymentsData.count,
      paidPayments: paymentsData.payeed,
      pendingPayments: paymentsData.notpayeed,
      totalAmountPaid: Math.round(totalAmountPaid),
      totalAmountPending: Math.round(totalAmountPending)
    };
  };

  const stats = getStatsFromData(ridesData);
  const paymentStats = getPaymentStats();

  const statsData = [
    {
      title: 'Total Rides',
      value: loading ? '...' : stats.totalRides.toString(),
      icon: Car,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600'
    },
    {
      title: 'Active Rides',
      value: loading ? '...' : stats.activeRides.toString(),
      icon: Users,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600'
    },
    {
      title: 'Transportation Cost',
      value: loading ? '...' : `Rs ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-600'
    },
    {
      title: 'Pending Payment',
      value: loading ? '...' : paymentStats.pendingPayments.toString(),
      icon: Clock,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-600'
    }
  ];

  // Process recent rides from real data
  const getRecentRides = (data: any) => {
    if (!data || !data.rides) return [];
    
    return data.rides
      .slice(0, 4) // Get first 4 rides
      .map((ride: any) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'completed': return 'text-green-600 bg-green-50';
            case 'active': 
            case 'start': return 'text-blue-600 bg-blue-50';
            case 'cancel': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
          }
        };

        const getStatusDisplay = (status: string) => {
          switch (status) {
            case 'completed': return 'Completed';
            case 'active': return 'Active';
            case 'start': return 'In Progress';
            case 'cancel': return 'Cancelled';
            default: return status;
          }
        };

        const formatLocation = (location: string) => {
          if (location.includes(',')) {
            const parts = location.split(',');
            return parts[0].length > 20 ? parts[0].substring(0, 20) + '...' : parts[0];
          }
          return location.length > 20 ? location.substring(0, 20) + '...' : location;
        };

        const route = `${formatLocation(ride.startLocation)} → ${formatLocation(ride.endLocation)}`;
        
        // Calculate total fare for the ride
        const totalFare = ride.passengers?.reduce((sum: number, passenger: any) => {
          return sum + (parseFloat(passenger.cost) || 0);
        }, 0) || 0;

        return {
          id: ride.rideId?.substring(0, 8) || ride.id?.substring(0, 8) || 'N/A',
          passenger: ride.passengers?.length > 0 ? `${ride.passengers.length} passenger(s)` : 'No passengers',
          driver: ride.driverId?.substring(0, 8) || 'Unknown',
          route: route,
          status: getStatusDisplay(ride.status),
          fare: totalFare > 0 ? `Rs ${totalFare.toFixed(2)}` : 'Rs 0.00',
          time: ride.date || 'Unknown',
          statusColor: getStatusColor(ride.status),
          cancelReason: ride.status === 'cancel' ? (ride.cancelReason || ride.reason || 'No reason provided') : null
        };
      });
  };

  const recentRides = getRecentRides(ridesData);

  const quickStats = [
    { label: 'Drivers Online', value: loading ? '...' : (usersData?.drivers || 0).toString(), icon: Car, color: 'text-blue-600' },
    { label: 'Total Users', value: loading ? '...' : (usersData?.count || 0).toString(), icon: Users, color: 'text-purple-600' },
    { label: 'Payment Paid', value: loading ? '...' : paymentStats.paidPayments.toString(), icon: CheckCircle, color: 'text-green-600' },
    { label: 'Total Passengers', value: loading ? '...' : (usersData?.passengers || 0).toString(), icon: User, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-8">
   

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${stat.bgColor} ring-2 ring-white`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Rides */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Rides</h3>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-6 text-center text-gray-500">
                  Loading rides data...
                </div>
              ) : recentRides.length > 0 ? (
                recentRides.map((ride: any, index: number) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-mono text-gray-500">#{ride.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${ride.statusColor}`}>
                            {ride.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{ride.passenger} </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{ride.route}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{ride.time}</span>
                            </div>
                          </div>
                          {ride.cancelReason && (
                            <div className="flex items-center space-x-1 text-sm text-red-600 mt-1">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="italic">Reason: {ride.cancelReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{ride.fare}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No rides data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Ride Completion</span>
                  <span className="font-medium">{loading ? '...' : `${Math.round((stats.completedRides / (stats.totalRides || 1)) * 100)}%`}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: loading ? '0%' : `${Math.round((stats.completedRides / (stats.totalRides || 1)) * 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Payment Success</span>
                  <span className="font-medium">{loading ? '...' : `${Math.round((paymentStats.paidPayments / (paymentStats.totalPayments || 1)) * 100)}%`}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: loading ? '0%' : `${Math.round((paymentStats.paidPayments / (paymentStats.totalPayments || 1)) * 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Active Rides</span>
                  <span className="font-medium">{loading ? '...' : `${stats.activeRides}/${stats.totalRides}`}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: loading ? '0%' : `${Math.round((stats.activeRides / (stats.totalRides || 1)) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Rides</span>
                <span className="font-semibold text-green-600">{loading ? '...' : stats.completedRides}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Transport Cost</span>
                <span className="font-semibold text-blue-600">{loading ? '...' : `Rs ${stats.totalRevenue.toLocaleString()}`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Paid</span>
                <span className="font-semibold text-green-600">{loading ? '...' : `Rs ${paymentStats.totalAmountPaid.toLocaleString()}`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-orange-600">{loading ? '...' : `Rs ${paymentStats.totalAmountPending.toLocaleString()}`}</span>
              </div>
            </div>
          </div>
          {/* User Management Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">User Statistics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold text-blue-600">{loading ? '...' : usersData?.count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Drivers</span>
                <span className="font-semibold text-green-600">{loading ? '...' : usersData?.drivers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Passengers</span>
                <span className="font-semibold text-purple-600">{loading ? '...' : usersData?.passengers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Approvals</span>
                <span className="font-semibold text-orange-600">{loading ? '...' : usersData?.users?.filter((user: any) => user.status === 'pending').length || 0}</span>
              </div>
            </div>
          </div>

          {/* Cost Management Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cost Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Costs</span>
                <span className="font-semibold text-blue-600">{loading ? '...' : paymentStats.totalPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Paid</span>
                <span className="font-semibold text-green-600">{loading ? '...' : paymentStats.paidPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-orange-600">{loading ? '...' : paymentStats.pendingPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount Pending</span>
                <span className="font-semibold text-red-600">{loading ? '...' : `Rs ${paymentStats.totalAmountPending.toLocaleString()}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Analytics */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Cost Analytics</h3>
        </div>
        <PaymentCharts 
          paymentsData={paymentsData} 
          ridesData={ridesData} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default DashboardPage;

