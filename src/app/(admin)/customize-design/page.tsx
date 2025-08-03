"use client";

import React from "react";

export default function CustomizeDesign() {
  return (
    <div className="w-full px-4 py-5 md:px-10 ">
      <form className="max-w-2xl w-full flex flex-col gap-6">
        {/* Home Page Photo */}
        <div>
          <label className="block mb-2 text-base text-gray-900 font-bold">Select Home Page Photo</label>
          <label className="inline-block cursor-pointer border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm transition">
            Select File, dimensions: **** x ****
            <input type="file" className="hidden" />
          </label>
        </div>
        {/* Text Inputs */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm text-gray-900 font-bold">Write text (Big Letters)</label>
            <input
              type="text"
              className="border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300 w-full"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm text-gray-900 font-bold">Text HEX color code:</label>
            <input
              type="text"
              defaultValue="#"
              className="border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm text-gray-900 font-bold">Write text (Small Letters)</label>
            <input
              type="text"
              className="border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300 w-full"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm text-gray-900 font-bold">Text HEX color code:</label>
            <input
              type="text"
              defaultValue="#"
              className="border border-gray-700 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300 w-full"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
