// import AdminHeader from '@/components/AdminHeader';
// import Sidebar from '@/components/SideBar';
import React from 'react';
import "@/app/globals.css"


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  
  return (
      <div className='flex'>
        <div className="flex-1">
          {children}
        </div>
      </div>  
  );
}
