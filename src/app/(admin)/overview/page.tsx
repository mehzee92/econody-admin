"use client";

import React from "react";

export default function Overview() {
  return (
    <div className="w-full px-4 py-5 md:px-10 ">
      <button className="mb-6 w-56 h-10 border border-gray-700 text-gray-700 rounded-lg  hover:bg-gray-100 transition">
        VIEW ALL MARKETPLACE
      </button>
      <div className="flex flex-col gap-2 mb-6">
        <div className="text-base text-gray-900">
          <span className="font-semibold">Total users:</span> <span className="font-normal italic">number</span>
        </div>
        <div className="text-base text-gray-900 flex items-center gap-2">
          <span className="font-semibold">Total Fees Collected last 30 days:</span> <span className="font-normal italic">number</span>
          <button className="ml-2 text-xs text-gray-700 underline hover:text-gray-900 transition p-0 bg-transparent border-0 shadow-none">View All</button>
        </div>
        <div className="text-base text-gray-900">
          <span className="font-semibold">Total Value Listed</span> <span className="italic text-gray-700">(all valuations of all object combined)</span>: <span className="font-normal italic">number</span>
        </div>
        <div className="text-base text-gray-900">
          <span className="font-semibold">Active listings:</span> <span className="font-normal italic">number</span>
        </div>
      </div>
      <select className="mb-6 w-80 h-10 px-3 border border-gray-700 text-gray-700 rounded-lg bg-white focus:outline-none focus:ring focus:ring-gray-300">
        <option>Select Wallet From which to deposit</option>
      </select>
      <div>
        <a href="#" className="text-gray-900 underline hover:text-gray-700 text-base font-medium">Export All History</a> <span className="text-gray-500 text-sm">(could be CSV)</span>
      </div>
    </div>
  );
}
