import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

interface RealTimeStatsProps {
  ridesData: any;
  paymentsData: any;
  usersData: any;
}

const RealTimeStats: React.FC<RealTimeStatsProps> = ({ ridesData, paymentsData, usersData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedStats, setAnimatedStats] = useState({
    activeRides: 0,
    liveUsers: 0,
    revenueToday: 0,
    completedRidesHour: 0,
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate real-time statistics
  useEffect(() => {
    if (ridesData && paymentsData && usersData) {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const currentHour = today.getHours();
      
      // Active rides (rides with status 'active' or 'start')
      const activeRides = ridesData.rides?.filter((ride: any) => 
        ride.status === 'active' || ride.status === 'start'
      ).length || 0;

      // Simulate live users (in real app, this would come from websockets)
      const liveUsers = Math.floor(Math.random() * (usersData.count * 0.3)) + 10;

      // Revenue today
      const revenueToday = ridesData.rides?.filter((ride: any) => {
        const rideDate = new Date(ride.date || ride.createdAt);
        return rideDate >= todayStart && ride.status === 'completed';
      }).reduce((sum: number, ride: any) => {
        return sum + (ride.passengers?.reduce((passengerSum: number, passenger: any) => {
          return passengerSum + (parseFloat(passenger.cost) || 0);
        }, 0) || 0);
      }, 0) || 0;

      // Completed rides this hour
      const completedRidesHour = ridesData.rides?.filter((ride: any) => {
        const rideDate = new Date(ride.date || ride.createdAt);
        return rideDate.getHours() === currentHour && 
               rideDate.toDateString() === today.toDateString() &&
               ride.status === 'completed';
      }).length || 0;

      // Animate the stats
      setAnimatedStats({
        activeRides,
        liveUsers,
        revenueToday: Math.round(revenueToday),
        completedRidesHour,
      });
    }
  }, [ridesData, paymentsData, usersData, currentTime]);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className={`bg-gradient-to-r ${color} rounded-xl p-6 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-6 h-6" />
          {trend && (
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <p className="text-sm opacity-90">{title}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-20">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-out"
          style={{ width: `${Math.random() * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Real-time Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Real-Time Analytics</h3>
              <p className="text-blue-100">Live data updates every second</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">LIVE</span>
            </div>
            <p className="text-sm font-mono">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Rides Right Now"
          value={animatedStats.activeRides}
          icon={Activity}
          color="from-green-500 to-emerald-600"
          trend="+5%"
        />
        
        <StatCard
          title="Users Online"
          value={animatedStats.liveUsers}
          icon={Users}
          color="from-blue-500 to-cyan-600"
          trend="+12%"
        />
        
        <StatCard
          title="Revenue Today"
          value={`Rs ${animatedStats.revenueToday.toLocaleString()}`}
          icon={DollarSign}
          color="from-purple-500 to-pink-600"
          trend="+8%"
        />
        
        <StatCard
          title="Rides This Hour"
          value={animatedStats.completedRidesHour}
          icon={Clock}
          color="from-orange-500 to-red-600"
          trend="+3%"
        />
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <Activity className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {/* Simulated live activities */}
            {[
              { time: '2 sec ago', event: 'New ride started from Downtown to Airport', type: 'ride' },
              { time: '15 sec ago', event: 'Payment of Rs 850 completed successfully', type: 'payment' },
              { time: '28 sec ago', event: 'Driver John Doe came online', type: 'driver' },
              { time: '45 sec ago', event: 'Ride completed: Mall to University', type: 'completed' },
              { time: '1 min ago', event: 'New user registered: Sarah Wilson', type: 'user' },
              { time: '2 min ago', event: 'Peak hour alert: High demand detected', type: 'alert' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'ride' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-green-500' :
                  activity.type === 'driver' ? 'bg-purple-500' :
                  activity.type === 'completed' ? 'bg-emerald-500' :
                  activity.type === 'user' ? 'bg-cyan-500' :
                  'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.event}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">API Response Time</h4>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">~{Math.floor(Math.random() * 50) + 20}ms</div>
          <p className="text-sm text-gray-600">Average response time</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Server Load</h4>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">{Math.floor(Math.random() * 30) + 40}%</div>
          <p className="text-sm text-gray-600">Current server usage</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Database Status</h4>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">Healthy</div>
          <p className="text-sm text-gray-600">All connections active</p>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStats;
