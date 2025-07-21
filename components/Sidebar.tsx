"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Car, 
  Grid3X3, 
  Users, 
  UserCheck, 
  Settings, 
  CreditCard, 
  LogOut 
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false, onClick }) => {
  return (
    <div 
      className={`px-4 py-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span className={isActive ? 'font-medium' : ''}>{label}</span>
    </div>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    try {
      console.log("Logout initiated..."); // Debug log
      
      // Clear authentication data from localStorage
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      console.log("Auth data cleared"); // Debug log
      
      // Navigate to root or login page
      router.replace("/");
      // Uncomment the line below if you have a dedicated login route
      // router.replace("/login");
      
      // Fallback reload (uncomment if router fails)
      // window.location.href = "/";
      
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const mainNavItems = [
{ icon: Grid3X3, label: 'Dashboard', isActive: pathname === '/dashboard', onClick: () => router.push('/dashboard') },
    { icon: Car, label: 'Rides', isActive: pathname === '/rides', onClick: () => router.push('/rides') },
    { icon: Users, label: 'Passengers', isActive: pathname === '/passengers', onClick: () => router.push('/passengers') },
    { icon: UserCheck, label: 'Drivers', isActive: pathname === '/drivers', onClick: () => router.push('/drivers') },
    { icon: Settings, label: 'Settings', isActive: pathname === '/settings', onClick: () => router.push('/settings') },
  ];

  const bottomNavItems = [
    { icon: CreditCard, label: 'Payment Details', onClick: () => router.push('/paymentDetails') },
    { icon: LogOut, label: 'Log out', onClick: handleLogout },
  ];

  return (
    <div className="w-80 bg-white shadow-lg">
      {/* Logo */}
      <div className="px-6 py-3 bg-slate-800 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              <span className="text-white">Car</span>
              <span className="text-orange-500">P</span>
              <span className="text-white">oo</span>
              <span className="text-blue-400">l</span>
            </h1>
            <p className="text-sm text-gray-300">WSO2</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {mainNavItems.map((item, index) => (
            <NavItem 
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              onClick={item.onClick}
            />
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="px-4 space-y-2">
            {bottomNavItems.map((item, index) => (
              <NavItem 
                key={index}
                icon={item.icon}
                label={item.label}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;


