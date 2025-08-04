"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken } from '../utils/auth';
import { Search, Bell, User, Upload, Settings, LogOut, ChevronDown } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
    initials: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          role: 'Administrator',
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
      
      // Close profile menu
      setShowProfileMenu(false);
      
      // Navigate to root or login page
      router.replace("/");
      
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const markAsRead = (id: number) => {
    console.log(`Marking notification ${id} as read`);
  };

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-3 h-3";
    switch (type) {
      case 'booking': return <div className={`${iconClass} bg-blue-500 rounded-full`}></div>;
      case 'payment': return <div className={`${iconClass} bg-green-500 rounded-full`}></div>;
      case 'status': return <div className={`${iconClass} bg-yellow-500 rounded-full`}></div>;
      case 'user': return <div className={`${iconClass} bg-purple-500 rounded-full`}></div>;
      case 'report': return <div className={`${iconClass} bg-gray-500 rounded-full`}></div>;
      default: return <div className={`${iconClass} bg-gray-400 rounded-full`}></div>;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">CarPool</h1>
            <p className="text-xs text-gray-500 -mt-1">Admin Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Enhanced Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users, rides, payments..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-80 text-sm placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-full border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200 overflow-hidden flex-shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Admin Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{userInfo?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
            </button>

            {/* Enhanced Profile Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{userInfo?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{userInfo?.email || 'admin@carpool.com'}</p>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">Online</span>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Overlay - Only show for notifications, not profile menu */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
          }}
        ></div>
      )}
      
      {/* Click outside handler for profile menu without overlay */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowProfileMenu(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Header;