"use client";

import React from "react";

export default function RevenueDistribution() {
  return (
    <div className="w-full px-4 py-5 md:px-10 ">
      {/* Left Section */}
      <div className="flex-1 max-w-xl">
        <button className="w-48 h-10 border border-gray-700 text-gray-700 rounded-lg font-semibold mb-4 hover:bg-gray-100 transition">
          SELECT ASSET
        </button>
        <div className="mt-2 mb-4">
          <div className="text-lg font-semibold text-gray-900">Asset <span className="font-normal">&quot;House Alabama&quot;</span></div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Contract Address: <span className="font-mono">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span></div>
        </div>
        <button className="mb-8 px-4 py-2 border border-gray-700 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
          View Revenue History
        </button>
        <div className="text-lg font-bold text-gray-900 mb-2 mt-8">Deposit Revenue</div>
        <form className="flex flex-col gap-4 max-w-sm">
          <button className="h-10 px-3 border border-gray-700 text-gray-700 rounded-lg bg-white focus:outline-none focus:ring focus:ring-gray-300">
            Select Wallet From which to deposit
          </button>
          <div className="flex items-center gap-2">
            <label className="w-1/2 text-gray-700 font-bold" htmlFor="">Amount USDT</label>
            <input
              type="number"
              placeholder="Amount USDT"
              className="h-10 px-3 border border-gray-700 text-gray-700 rounded-lg bg-white focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          <div className="flex items-center gap-2">
          <label className="w-1/2 text-gray-700 font-bold" htmlFor="">Description</label>
          <input
            type="text"
            placeholder="Description"
            className="h-10 px-3 border border-gray-700 text-gray-700 rounded-lg bg-white focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>

        <div className="flex items-center gap-2">
        <label className="w-1/2 text-gray-700 font-bold" htmlFor="">Code</label>
          <input
            type="text"
            placeholder="Code"
            className="h-10 px-3 border border-gray-700 text-gray-700 rounded-lg bg-white focus:outline-none focus:ring focus:ring-gray-300"
          />
          </div>
          <button type="submit" className="mt-2 h-10 border border-gray-700 text-gray-700 rounded-lg  hover:bg-gray-100 transition">
            Confirm Deposit Revenue
          </button>
        </form>
      </div>
      {/* Right Section: Notes (for dev reference, not visible in UI) */}
      {/*
      <div className="hidden md:block flex-1">
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 text-sm text-gray-800">
          <div>should be able to distribute revenue from rent.</div>
          <div className="mt-2">This should allow to press a supported asset (it should be tokenized that way), lets assume it is already selected for fields</div>
        </div>
      </div>
      */}
    </div>
  );
}
