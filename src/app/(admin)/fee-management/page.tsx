'use client';

import React from 'react';

export default function FeeManagementForm() {
  return (
    <div className="w-full px-4 py-5 md:px-10">
      {/* Configure Fees Button */}
      <div className="mb-6">
        <button className="border text-gray-700 w-[200px] border-gray-700 rounded-lg px-5 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition">
          CONFIGURE FEES
        </button>
      </div>

      {/* Global Fee Input */}
      <div className="mb-6">
        <label className="block mb-1 text-sm text-gray-700 font-bold">
          Global Fee % <span className="text-gray-600">(default, if not set different)</span>
        </label>
        <input
          type="text"
          className="w-[150px] border text-gray-700 border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
        />
      </div>

      {/* Per Asset Override */}
      <div className="mb-6">
        <label className="block mb-1 text-sm text-gray-700 font-bold">Per Asset Override</label>
        <button className="border w-[150px] text-gray-700 border-gray-700 rounded-lg px-10 py-2 text-sm font-medium hover:bg-gray-100 transition">
          Select
        </button>
      </div>

      {/* Collected Fees Wallet */}
      <div className="mb-6">
        <label className="block mb-1 text-sm text-gray-700 font-bold">Collected Fees recipient wallet</label>
        <input
          type="text"
          className="w-full border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
        />
      </div>

      {/* Export Link */}
      <div className="mb-2">
        <a
          href="#"
          className="text-sm font-bold text-gray-800 hover:underline"
        >
          Export Fee History <span className="text-gray-600">(could be CSV)</span>
        </a>
      </div>
    </div>
  );
}
