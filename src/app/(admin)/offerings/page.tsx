'use client';

import React, { useState } from 'react';

export default function TokenOfferingForm() {
  const [applyCliff, setApplyCliff] = useState(false);

  return (
    <div className="w-full px-4 py-5 md:px-10 text-gray-700">
      {/* Top Buttons */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button className="border border-gray-700 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition">
          + LIST NEW TOKEN OFFERING
        </button>
        <button className="border border-gray-700 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition">
          VIEW ALL
        </button>
        <button className="border border-gray-700 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition">
          EDIT OFFERINGS
        </button>
      </div>

      {/* Form */}
      <form className="space-y-2">
        {/* Token Select */}
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-bold">Token <span className="italic">(Select from owned list)</span></label>
          <label className="inline-block cursor-pointer border text-gray-700 border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold transition">
            Select Files
            <input
              type="file"
              multiple
              className="hidden"
            />
          </label>
        </div>

        {/* Quantity to Sell */}
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-bold">Quantity to sell</label>
          <input
            type="text"
            className="w-full border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>

        {/* Price per Token */}
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-bold">
            Price per token USD <span className="ml-4 text-gray-600">Total Value: (calculate automatically)</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>

        {/* Apply Cliff */}
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-bold">
            Apply Cliff? <span className="italic text-gray-600">(optional)</span>
            {applyCliff && (
              <button
                type="button"
                onClick={() => setApplyCliff(false)}
                className="ml-2 px-2 py-1 text-sm text-gray-700 border border-gray-700 rounded-lg hover:bg-gray-200"
              >
                X
              </button>
            )}
          </label>
          {!applyCliff && (
            <button
              type="button"
              onClick={() => setApplyCliff(true)}
              className="mt-1 px-4 py-1 text-sm text-gray-700 border border-gray-700 rounded-lg hover:bg-gray-100"
            >
              Enable Cliff
            </button>
          )}
        </div>

        {/* Cliff Fields */}
        {applyCliff && (
          <div className="flex flex-col max-w-[300px] gap-2">
            <div className='flex gap-5 items-center'>
              <label className="block w-1/2 mb-1 text-sm text-gray-700 font-bold">Cliff Days (X)</label>
              <input
                type="text"
                className="w-full border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
              />
            </div>
            <div className='flex gap-5 items-center'>
              <label className="block w-1/2 mb-1 text-sm text-gray-700 font-bold">Unlocks (Y)</label>
              <input
                type="text"
                className="w-full border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
              />
            </div>
            <div className='flex gap-5 items-center'>
              <label className="block w-1/2 mb-1 text-sm text-gray-700 font-bold">% to Vest (Z)</label>
              <input
                type="text"
                className="w-full border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
              />
            </div>
          </div>
        )}

        {/* Admin or Wallet */}
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-bold">
            Sell as Admin or On Behalf of Wallet <span className="italic text-gray-600">(maybe select wallet and sign with that wallet?)</span>
          </label>
          <label className="inline-block cursor-pointer text-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold transition">
            Select Files
            <input
              type="file"
              multiple
              className="hidden"
            />
          </label>
        </div>

        {/* Attach to Listing */}
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-bold">Select Asset Listing to attach to</label>
          <label className="inline-block cursor-pointer text-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold transition">
            Select Files
            <input
              type="file"
              multiple
              className="hidden"
            />
          </label>
        </div>
      </form>
    </div>
  );
}
