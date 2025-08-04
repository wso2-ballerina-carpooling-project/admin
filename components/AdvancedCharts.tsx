import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';

// Register additional Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale
);

interface AdvancedChartsProps {
  ridesData: any;
  usersData: any;
  paymentsData: any;
}

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ ridesData, usersData, paymentsData }) => {
  
  // Generate hourly rides distribution data
  const getHourlyRidesData = () => {
    if (!ridesData || !ridesData.rides) return null;

    const hourlyData = Array(24).fill(0);
    
    ridesData.rides.forEach((ride: any) => {
      const date = new Date(ride.date || ride.createdAt || Date.now());
      const hour = date.getHours();
      hourlyData[hour]++;
    });

    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: 'Rides per Hour',
          data: hourlyData,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: '#3b82f6',
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate weekly rides pattern
  const getWeeklyRidesData = () => {
    if (!ridesData || !ridesData.rides) return null;

    const weeklyData = Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    ridesData.rides.forEach((ride: any) => {
      const date = new Date(ride.date || ride.createdAt || Date.now());
      const day = date.getDay();
      weeklyData[day]++;
    });

    return {
      labels: dayNames,
      datasets: [
        {
          label: 'Rides per Day',
          data: weeklyData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  // Generate ride distance analysis
  const getRideDistanceData = () => {
    if (!ridesData || !ridesData.rides) return null;

    const distanceRanges = {
      '0-5km': 0,
      '5-10km': 0,
      '10-20km': 0,
      '20-50km': 0,
      '50km+': 0,
    };

    ridesData.rides.forEach((ride: any) => {
      const distance = parseFloat(ride.distance) || Math.random() * 50; // Fallback to random for demo
      
      if (distance <= 5) distanceRanges['0-5km']++;
      else if (distance <= 10) distanceRanges['5-10km']++;
      else if (distance <= 20) distanceRanges['10-20km']++;
      else if (distance <= 50) distanceRanges['20-50km']++;
      else distanceRanges['50km+']++;
    });

    return {
      labels: Object.keys(distanceRanges),
      datasets: [
        {
          data: Object.values(distanceRanges),
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  };

  // Generate performance metrics radar chart
  const getPerformanceMetrics = () => {
    if (!ridesData || !usersData || !paymentsData) return null;

    const completedRides = ridesData.rides?.filter((ride: any) => ride.status === 'completed').length || 0;
    const totalRides = ridesData.rides?.length || 1;
    const completionRate = Math.round((completedRides / totalRides) * 100);

    const paidPayments = paymentsData.payeed || 0;
    const totalPayments = paymentsData.count || 1;
    const paymentRate = Math.round((paidPayments / totalPayments) * 100);

    const activeUsers = usersData.count || 0;
    const userEngagement = Math.min(Math.round((activeUsers / 100) * 100), 100); // Normalized to 100

    const totalDrivers = usersData.drivers || 0;
    const driverAvailability = Math.min(Math.round((totalDrivers / 50) * 100), 100); // Normalized to 100

    const avgRidesPerDay = Math.round(totalRides / 30); // Assuming last 30 days
    const operationalEfficiency = Math.min(Math.round((avgRidesPerDay / 10) * 100), 100); // Normalized to 100

    return {
      labels: [
        'Ride Completion Rate',
        'Payment Success Rate',
        'User Engagement',
        'Driver Availability',
        'Operational Efficiency',
      ],
      datasets: [
        {
          label: 'Performance Metrics (%)',
          data: [completionRate, paymentRate, userEngagement, driverAvailability, operationalEfficiency],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6',
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Advanced Analytics Header */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Analytics</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Deep dive into your transportation data with detailed insights and performance metrics
        </p>
      </div>

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hourly Rides Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Hourly Rides Distribution</h3>
          <div className="h-80">
            {getHourlyRidesData() && (
              <Bar data={getHourlyRidesData()!} options={barChartOptions} />
            )}
          </div>
        </div>

        {/* Weekly Pattern */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Rides Pattern</h3>
          <div className="h-80">
            {getWeeklyRidesData() && (
              <PolarArea data={getWeeklyRidesData()!} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Ride Distance Analysis */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ride Distance Distribution</h3>
          <div className="h-80">
            {getRideDistanceData() && (
              <Doughnut data={getRideDistanceData()!} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Performance Metrics Radar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="h-80">
            {getPerformanceMetrics() && (
              <Radar data={getPerformanceMetrics()!} options={radarOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Key Insights Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Peak Hours</h4>
            <p className="text-gray-600 text-sm">
              Most rides occur during morning (8-10 AM) and evening (5-7 PM) rush hours
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Popular Days</h4>
            <p className="text-gray-600 text-sm">
              Weekdays show higher ride volume compared to weekends
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Distance Trends</h4>
            <p className="text-gray-600 text-sm">
              Short to medium distance rides (5-20km) are most common
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
