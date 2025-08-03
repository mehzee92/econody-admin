"use client"
import AdminHeader from '@/components/AdminHeader';
import LoginForm from "@/app/login/page";

import Sidebar from '@/components/SideBar';
import React from 'react';
import "@/app/globals.css"
import useUserStore  from '@/stores/userStore';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { isLoggedIn } = useUserStore();

  return (
    <html>
      <body>
      <div className="">
      <AdminHeader />
      
      { isLoggedIn ? (
        <div className='flex'>
          <Sidebar />
          <div className="flex-1">
            {children}
          </div>
        </div>
      ) : (
        <LoginForm />
      ) }





    </div>
      </body>
      
    </html>
  
  );
}
