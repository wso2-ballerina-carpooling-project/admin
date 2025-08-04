"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserFromToken } from '../utils/auth';
import { 
  Car, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Settings, 
  CreditCard, 
  LogOut,
  MapPin,
  BarChart3,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string;
  isCollapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false, onClick, badge, isCollapsed = false }) => {
  return (
    <div 
      className={`group relative ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} rounded-xl flex items-center ${isCollapsed ? '' : 'space-x-3'} cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={onClick}
      title={isCollapsed ? label : undefined} // Show tooltip only when collapsed
    >
      <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
      {!isCollapsed && <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{label}</span>}
      {!isCollapsed && badge && (
        <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
          isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-blue-100 text-blue-600'
        }`}>
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
    initials: string;
  } | null>(null);

  useEffect(() => {
    const loadUserInfo = () => {
      const user = getUserFromToken();
      if (user) {
        const name = user.name || user.username || user.email?.split('@')[0] || 'Admin';
        const email = user.email || 'admin@carpool.com';
        const role = user.role || 'Administrator';
        
        // Generate initials from name
        const initials = name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('');
        
        setUserInfo({
          name,
          email,
          role,
          initials: initials || 'AD'
        });
      } else {
        // Fallback to default values if no token
        setUserInfo({
          name: 'Admin User',
          email: 'admin@carpool.com',
          role: 'Super Administrator',
          initials: 'AD'
        });
      }
    };

    loadUserInfo();
  }, []);

  const handleLogout = () => {
    try {
      console.log("Logout initiated...");
      
      // Clear authentication data from localStorage
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      console.log("Auth data cleared");
      
      // Navigate to root or login page
      router.replace("/");
      
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const mainNavItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      isActive: pathname === '/dashboard', 
      onClick: () => router.push('/dashboard'),
      badge: '5'
    },
    { 
      icon: Car, 
      label: 'Rides', 
      isActive: pathname === '/rides', 
      onClick: () => router.push('/rides'),
      badge: '12'
    },
    { 
      icon: Users, 
      label: 'Passengers', 
      isActive: pathname === '/passengers', 
      onClick: () => router.push('/passengers'),
      badge: '148'
    },
    { 
      icon: UserCheck, 
      label: 'Drivers', 
      isActive: pathname === '/drivers', 
      onClick: () => router.push('/drivers'),
      badge: '23'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      isActive: pathname === '/analytics', 
      onClick: () => router.push('/analytics')
    },
  ];

  const secondaryNavItems = [
    // { 
    //   icon: Bell, 
    //   label: 'Notifications', 
    //   isActive: pathname === '/notifications', 
    //   onClick: () => router.push('/notifications'),
    //   badge: '3'
    // },
    { 
      icon: Settings, 
      label: 'Settings', 
      isActive: pathname === '/settings', 
      onClick: () => router.push('/settings')
    },
  ];

  const bottomNavItems = [
    { 
      icon: CreditCard, 
      label: 'Payment Details', 
      onClick: () => router.push('/paymentDetails')
    },
    { 
      icon: LogOut, 
      label: 'Log out', 
      onClick: handleLogout
    },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} bg-white shadow-2xl border-r border-gray-100 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="px-6 py-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-orange-500/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-white">Car</span>
                  <span className="text-orange-400">P</span>
                  <span className="text-white">ool</span>
                </h1>
                <p className="text-sm text-blue-200 font-medium">Admin Dashboard</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Profile */}
      {!isCollapsed && userInfo && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{userInfo.initials}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{userInfo.name}</p>
              <p className="text-sm text-gray-500">{userInfo.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 pt-6 pb-4 overflow-y-auto">
        {/* Main Navigation */}
        <div className="px-4 space-y-1">
          <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {!isCollapsed && 'Main Menu'}
          </div>
          {mainNavItems.map((item, index) => (
            <NavItem 
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              onClick={item.onClick}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
        
        {/* Secondary Navigation */}
        <div className="mt-8 px-4 space-y-1">
          <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {!isCollapsed && 'System'}
          </div>
          {secondaryNavItems.map((item, index) => (
            <NavItem 
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              onClick={item.onClick}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-1">
        {bottomNavItems.map((item, index) => (
          <NavItem 
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;