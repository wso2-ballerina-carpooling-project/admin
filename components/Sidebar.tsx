



// import React from 'react';
// import { 
//   Car, 
//   Grid3X3, 
//   Users, 
//   UserCheck, 
//   Settings, 
//   CreditCard, 
//   LogOut 
// } from 'lucide-react';

// interface NavItemProps {
//   icon: React.ElementType;
//   label: string;
//   isActive?: boolean;
//   onClick?: () => void;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false, onClick }) => {
//   return (
//     <div 
//       className={`px-4 py-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${
//         isActive 
//           ? 'bg-blue-100 text-blue-600' 
//           : 'text-gray-600 hover:bg-gray-50'
//       }`}
//       onClick={onClick}
//     >
//       <Icon className="w-5 h-5" />
//       <span className={isActive ? 'font-medium' : ''}>{label}</span>
//     </div>
//   );
// };

// const Sidebar = () => {
//   const mainNavItems = [
//     { icon: Grid3X3, label: 'Dashboard', isActive: true },
//     { icon: Car, label: 'Rides' },
//     { icon: Users, label: 'Passengers' },
//     { icon: UserCheck, label: 'Drivers' },
//     { icon: Settings, label: 'Settings' },
//   ];

//   const bottomNavItems = [
//     { icon: CreditCard, label: 'Payment Details' },
//     { icon: LogOut, label: 'Log out' },
//   ];

//   return (
//     <div className="w-80 bg-white shadow-lg">
//       {/* Logo */}
//       <div className="p-6 bg-slate-800 text-white">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//             <Car className="w-6 h-6" />
//           </div>
//           <div>
//              <h1 className="text-xl font-bold">
//               <span className="text-white">Car</span>
//               <span className="text-orange-500">P</span>
//               <span className="text-white">oo</span>
//               <span className="text-blue-400">l</span>
//             </h1>
//             <p className="text-sm text-gray-300">WSO2</p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-8">
//         <div className="px-4 space-y-2">
//           {mainNavItems.map((item, index) => (
//             <NavItem 
//               key={index}
//               icon={item.icon}
//               label={item.label}
//               isActive={item.isActive}
//             />
//           ))}
//         </div>
        
//         <div className="mt-8 pt-8 border-t border-gray-200">
//           <div className="px-4 space-y-2">
//             {bottomNavItems.map((item, index) => (
//               <NavItem 
//                 key={index}
//                 icon={item.icon}
//                 label={item.label}
//               />
//             ))}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;



// "use client";

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Car, 
//   Grid3X3, 
//   Users, 
//   UserCheck, 
//   Settings, 
//   CreditCard, 
//   LogOut 
// } from 'lucide-react';

// interface NavItemProps {
//   icon: React.ElementType;
//   label: string;
//   isActive?: boolean;
//   onClick?: () => void;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false, onClick }) => {
//   return (
//     <div 
//       className={`px-4 py-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${
//         isActive 
//           ? 'bg-blue-100 text-blue-600' 
//           : 'text-gray-600 hover:bg-gray-50'
//       }`}
//       onClick={onClick}
//     >
//       <Icon className="w-5 h-5" />
//       <span className={isActive ? 'font-medium' : ''}>{label}</span>
//     </div>
//   );
// };

// const Sidebar = () => {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       // Clear authentication data from localStorage
//       localStorage.removeItem("auth");
      
//       // You might also want to clear other auth-related data
//       // localStorage.removeItem("token");
//       // localStorage.removeItem("user");
      
//       // Clear all localStorage if needed
//       // localStorage.clear();
      
//       // Try different redirect methods:
      
//       // Method 1: router.push (App Router)
//       await router.push("/login");
      
//       // Method 2: router.replace (if you don't want back button to work)
//       // await router.replace("/login");
      
//       // Method 3: Force page reload (fallback)
//       // window.location.href = "/login";
      
//       // Method 4: For pages router (Next.js 12 and below)
//       // router.push("/login");
      
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Fallback redirect with page reload
//       window.location.href = "/login";
//     }
//   };

//   const mainNavItems = [
//     { icon: Grid3X3, label: 'Dashboard', isActive: true, onClick: undefined },
//     { icon: Car, label: 'Rides', onClick: undefined },
//     { icon: Users, label: 'Passengers', onClick: undefined },
//     { icon: UserCheck, label: 'Drivers', onClick: undefined },
//     { icon: Settings, label: 'Settings', onClick: undefined },
//   ];

//   const bottomNavItems = [
//     { icon: CreditCard, label: 'Payment Details' },
//     { icon: LogOut, label: 'Log out', onClick: handleLogout },
//   ];

//   return (
//     <div className="w-80 bg-white shadow-lg">
//       {/* Logo */}
//       <div className="p-6 bg-slate-800 text-white">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//             <Car className="w-6 h-6" />
//           </div>
//           <div>
//              <h1 className="text-xl font-bold">
//               <span className="text-white">Car</span>
//               <span className="text-orange-500">P</span>
//               <span className="text-white">oo</span>
//               <span className="text-blue-400">l</span>
//             </h1>
//             <p className="text-sm text-gray-300">WSO2</p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-8">
//         <div className="px-4 space-y-2">
//           {mainNavItems.map((item, index) => (
//             <NavItem 
//               key={index}
//               icon={item.icon}
//               label={item.label}
//               isActive={item.isActive}
//               onClick={item.onClick}
//             />
//           ))}
//         </div>
        
//         <div className="mt-8 pt-8 border-t border-gray-200">
//           <div className="px-4 space-y-2">
//             {bottomNavItems.map((item, index) => (
//               <NavItem 
//                 key={index}
//                 icon={item.icon}
//                 label={item.label}
//                 onClick={item.onClick}
//               />
//             ))}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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

  const handleLogout = () => {
    try {
      console.log("Logout initiated..."); // Debug log
      
      // Clear authentication data from localStorage
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      console.log("Auth data cleared"); // Debug log
      
      // Method 1: Try router.replace to root (if login page is at root)
      router.replace("/");
      
      // Method 2: If you have a dedicated login route, uncomment this:
      // router.replace("/login");
      
      // Method 3: Force page reload as fallback (uncomment if router doesn't work)
      // window.location.href = "/";
      
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect with page reload
      window.location.href = "/";
    }
  };

  const mainNavItems = [
    { icon: Grid3X3, label: 'Dashboard', isActive: true, onClick: undefined },
    { icon: Car, label: 'Rides', onClick: undefined },
    { icon: Users, label: 'Passengers', onClick: undefined },
    { icon: UserCheck, label: 'Drivers', onClick: undefined },
    { icon: Settings, label: 'Settings', onClick: undefined },
  ];

  const bottomNavItems = [
    { icon: CreditCard, label: 'Payment Details' },
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