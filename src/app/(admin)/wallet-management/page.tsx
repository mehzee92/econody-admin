'use client';

import React from 'react';

export default function FeeManagementForm() {
  return (
    <div className="w-full px-4 py-5 md:px-10">
      {/*  CONFIGURE ADMIN WALLETS Button */}
      <div className="mb-6 flex gap-2">
        <button className="border w-[300px] text-gray-700 border-gray-700 rounded-lg px-5 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition">
           CONFIGURE ADMIN WALLETS
        </button>
        <button className="border w-[300px] text-gray-700 border-gray-700 rounded-lg px-5 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition">
           EDIT WALLETS OF USERS
        </button>
      </div>
      
    </div>
  );
}
