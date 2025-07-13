// import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex h-screen">
//       <Sidebar />
//       <div className="flex flex-col flex-1">
//         <Header />
//         <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// }



import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;