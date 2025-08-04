'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  User, 
  Car, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone
} from 'lucide-react';

// Types
interface Payment {
  id: string;
  amount: string;
  user: any; // This can be either a user ID string or a full user object
  ride: string; // This is the rideId
  createdAt: string | any[]; // Can be timestamp string or array with timestamp objects
  isPaid: boolean;
  method?: string;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  passwordHash?: string;
  fcm?: string;
  createdAt?: string;
  driverDetails?: {
    seatingCapacity: number;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleRegistrationNumber: string;
    vehicleType: string;
  };
}

interface PaymentWithDriver extends Payment {
  driver?: Driver;
}

// Chart component using CSS
const BarChart: React.FC<{ data: { month: string; amount: number }[]; title: string }> = ({ data, title }) => {
  // Filter out months with zero amounts for a cleaner view, or show all for comparison
  const filteredData = data.filter(item => item.amount > 0);
  const displayData = filteredData.length > 0 ? data : data; // Show all months for context
  
  const maxValue = Math.max(...displayData.map(d => d.amount), 1);
  
  console.log('Chart data:', displayData);
  console.log('Max value:', maxValue);
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="h-64 flex items-end space-x-2">
        {displayData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className={`w-full rounded-t-lg relative ${
                item.amount > 0 
                  ? 'bg-gradient-to-t from-green-500 to-green-300' 
                  : 'bg-gray-200'
              }`}
              style={{ 
                height: item.amount > 0 
                  ? `${Math.max(20, (item.amount / maxValue) * 200)}px` 
                  : '10px' // Small height for zero amounts
              }}
            >
              {item.amount > 0 && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                  Rs {item.amount.toLocaleString()}
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-600 text-center">{item.month}</div>
          </div>
        ))}
      </div>
      
      {/* Show a message if no data */}
      {filteredData.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          <p className="text-sm">No payment data available for this period</p>
        </div>
      )}
    </div>
  );
};

interface PaymentStatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

const PaymentStatsCard: React.FC<PaymentStatsCardProps> = ({ 
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
      {change && (
        <div className={`text-sm font-medium ${
          changeType === 'increase' ? 'text-green-600' : 
          changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {change}
        </div>
      )}
    </div>
  </div>
);

export default function PaymentPage() {
  const [payments, setPayments] = useState<PaymentWithDriver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [updatingPayments, setUpdatingPayments] = useState<Set<string>>(new Set());

  // Mark payment as paid
  const markAsPaid = async (driverId: string, groupPayments: any[]) => {
    setUpdatingPayments(prev => new Set(prev).add(driverId));
    
    try {
      // Get all pending payments for this driver
      const pendingPayments = groupPayments.filter(payment => !payment.isPaid);
      
      // Update each pending payment to paid status
      for (const payment of pendingPayments) {
        const response = await fetch(`http://localhost:9090/api/payments/${payment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...payment,
            isPaid: true
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update payment ${payment.id}`);
        }
      }
      
      // Update local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          pendingPayments.some(p => p.id === payment.id) 
            ? { ...payment, isPaid: true }
            : payment
        )
      );
      
    } catch (error) {
      console.error('Error marking payments as paid:', error);
      alert('Failed to mark payments as paid. Please try again.');
    } finally {
      setUpdatingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(driverId);
        return newSet;
      });
    }
  };

  // Fetch payments and driver details
  useEffect(() => {
    const fetchPaymentsAndDrivers = async () => {
      setIsLoading(true);
      try {
        // Fetch payments data
        const paymentsResponse = await fetch('http://localhost:9090/api/payments');
        if (!paymentsResponse.ok) {
          throw new Error('Failed to fetch payments data');
        }
        const paymentsData = await paymentsResponse.json();
        const paymentsArray = paymentsData.payment || [];

        // Fetch driver details for each payment from the driver endpoint
        const paymentsWithDrivers = await Promise.all(
          paymentsArray.map(async (payment: Payment) => {
            try {
              if (payment.user) {
                // Extract the user ID from the user object or use the user field directly
                const userId = typeof payment.user === 'string' ? payment.user : payment.user.id;
                const driverResponse = await fetch(`http://localhost:9090/api/driver/${userId}`);
                if (driverResponse.ok) {
                  const driverData = await driverResponse.json();
                  // Extract the User object from the response
                  const userDetails = driverData.User || driverData;
                  return {
                    ...payment,
                    driver: userDetails
                  };
                }
              }
              // If no user ID or driver fetch fails, use embedded user data as fallback
              return {
                ...payment,
                driver: payment.user
              };
            } catch (error) {
              console.error(`Error fetching driver details:`, error);
              // Fallback to embedded user data
              return {
                ...payment,
                driver: payment.user
              };
            }
          })
        );

        setPayments(paymentsWithDrivers);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching payment data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentsAndDrivers();
  }, []);

  // Calculate statistics
  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.isPaid === true).length;
  const pendingPayments = payments.filter(p => p.isPaid === false).length;
  const totalRevenue = payments
    .filter(p => p.isPaid === true)
    .reduce((sum, payment) => sum + (parseFloat(payment.amount || '0') || 0), 0);

  // Group payments by driver and status
  const groupedPayments = payments.reduce((acc, payment) => {
    if (!payment.driver?.id) return acc;
    
    const driverId = payment.driver.id;
    if (!acc[driverId]) {
      acc[driverId] = {
        driver: payment.driver,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        totalPayments: 0,
        paidPayments: 0,
        pendingPayments: 0,
        payments: []
      };
    }
    
    const amount = parseFloat(payment.amount || '0') || 0;
    acc[driverId].totalAmount += amount;
    acc[driverId].totalPayments += 1;
    acc[driverId].payments.push(payment);
    
    if (payment.isPaid) {
      acc[driverId].paidAmount += amount;
      acc[driverId].paidPayments += 1;
    } else {
      acc[driverId].pendingAmount += amount;
      acc[driverId].pendingPayments += 1;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const groupedPaymentsArray = Object.values(groupedPayments);
  
  // Separate drivers with pending and paid payments
  const driversWithPending = groupedPaymentsArray.filter(group => group.pendingPayments > 0);
  const driversWithPaid = groupedPaymentsArray.filter(group => group.paidPayments > 0);

  // Generate monthly data for chart based on actual payment dates
  const generateMonthlyData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    // Initialize all months with 0
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    months.forEach(month => {
      monthlyData[month] = 0;
    });
    
    // Process all payments regardless of isPaid status
    payments.forEach(payment => {
      try {
        let paymentDate;
        
        if (payment.createdAt) {
          if (typeof payment.createdAt === 'string') {
            // Handle string format like "[1752829004,0.744003813]"
            try {
              const timestampArray = JSON.parse(payment.createdAt);
              const timestamp = timestampArray[0];
              paymentDate = new Date(timestamp * 1000);
            } catch {
              // If JSON parse fails, try direct parsing
              paymentDate = new Date(payment.createdAt);
            }
          } else if (Array.isArray(payment.createdAt) && payment.createdAt[0]) {
            // Handle array format with timestamp object
            const timestampObj = payment.createdAt[0];
            if (timestampObj && typeof timestampObj === 'object' && 'seconds' in timestampObj) {
              paymentDate = new Date((timestampObj as any).seconds * 1000);
            } else if (typeof timestampObj === 'number') {
              paymentDate = new Date(timestampObj * 1000);
            } else if (typeof timestampObj === 'string') {
              // Handle ISO string format
              paymentDate = new Date(timestampObj);
            }
          }
          
          if (paymentDate && !isNaN(paymentDate.getTime())) {
            const monthIndex = paymentDate.getMonth();
            const monthName = months[monthIndex];
            const amount = parseFloat(payment.amount || '0') || 0;
            monthlyData[monthName] += amount;
            
            console.log(`Payment processed: ${paymentDate.toDateString()} -> ${monthName}, Amount: Rs ${amount}`);
          } else {
            console.warn('Could not parse payment date:', payment.createdAt);
          }
        }
      } catch (error) {
        console.warn('Error processing payment date:', error, payment.createdAt);
      }
    });

    return months.map(month => ({
      month,
      amount: monthlyData[month]
    }));
  };

  const monthlyData = generateMonthlyData();
  console.log('Generated monthly data:', monthlyData);
  
  // Use real data only - no fallback dummy data
  const chartData = monthlyData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">Error loading payment data</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
     

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PaymentStatsCard
          title="Total Payments"
          value={totalPayments.toString()}
          change="+8%"
          changeType="increase"
          icon={CreditCard}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <PaymentStatsCard
          title="Paid Payments"
          value={completedPayments.toString()}
          change="+12%"
          changeType="increase"
          icon={CheckCircle}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <PaymentStatsCard
          title="Pending Payments"
          value={pendingPayments.toString()}
          icon={Clock}
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
        />
        <PaymentStatsCard
          title="Total Revenue"
          value={`Rs ${totalRevenue.toLocaleString()}`}
          change="+15%"
          changeType="increase"
          icon={DollarSign}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Payment Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pending Payments Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Pending Payments</h2>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {driversWithPending.length} drivers
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
                      <span>Driver</span>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4" />
                      <span>Vehicle</span>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Pending Amount</span>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Count</span>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {driversWithPending.map((group) => (
                  <tr key={`pending-${group.driver.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {group.driver ? `${group.driver.firstName} ${group.driver.lastName}` : 'Unknown Driver'}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {group.driver?.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{group.driver.email}</span>
                              </div>
                            )}
                            {group.driver?.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{group.driver.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {group.driver?.driverDetails 
                            ? `${group.driver.driverDetails.vehicleBrand} ${group.driver.driverDetails.vehicleModel} (${group.driver.driverDetails.vehicleRegistrationNumber})`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-yellow-700">
                        Rs {group.pendingAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {group.pendingPayments} pending
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => markAsPaid(group.driver.id, group.payments)}
                        disabled={updatingPayments.has(group.driver.id)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          updatingPayments.has(group.driver.id)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                        }`}
                      >
                        {updatingPayments.has(group.driver.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-1"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark as Paid
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {driversWithPending.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No pending payments</p>
                      <p className="text-sm">All payments are up to date</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paid Payments Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Paid Payments</h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {driversWithPaid.length} drivers
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
                      <span>Driver</span>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4" />
                      <span>Vehicle</span>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Paid Amount</span>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Count</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {driversWithPaid.map((group) => (
                  <tr key={`paid-${group.driver.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {group.driver ? `${group.driver.firstName} ${group.driver.lastName}` : 'Unknown Driver'}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {group.driver?.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{group.driver.email}</span>
                              </div>
                            )}
                            {group.driver?.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{group.driver.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {group.driver?.driverDetails 
                            ? `${group.driver.driverDetails.vehicleBrand} ${group.driver.driverDetails.vehicleModel} (${group.driver.driverDetails.vehicleRegistrationNumber})`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-green-700">
                        Rs {group.paidAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {group.paidPayments} paid
                      </span>
                    </td>
                  </tr>
                ))}
                {driversWithPaid.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No paid payments</p>
                      <p className="text-sm">Payment history will appear here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction History Chart */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Year:</span>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
          <BarChart data={chartData} title="" />
        </div>
      </div>
    </div>
  );
}
