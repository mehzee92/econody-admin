"use client";
import { useState, useEffect } from "react";
import ReserveVaultAbi from "@/abi/ReserveVault";
import {  RESERVE_VAULT, toEth, t2dt } from '@/components/const'
import {  readContract } from "@wagmi/core";
import { config } from "../../wagmi";




export default function ExpensesHistory() {


 const[revenues, setRevenues] = useState();

  const fetchPendingDues = async () => {
    try {
      const result = await readContract(config, {
        address: RESERVE_VAULT,
        abi: ReserveVaultAbi,
        functionName: "getRewardsLastFifty",
      });

      // Map to objects and filter out id == 0
      const _revenues = result
        .map((row) => ({
          id: row.id.toString(),
          asset_id: row.asset_id.toString(),
          amount: toEth(row.amount.toString()),
          description: row.description.toString(),
          timestamp: parseInt(row.timestamp.toString(), 10),
        }))
        .filter((row) => row.id !== "0");

      setRevenues(_revenues);
    } catch (error) {
      console.error("Error fetching pending dues:", error);
    }
  };


  useEffect(()=>{
      fetchPendingDues();
  }, [])


  return (
    <div className="p-6  ">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Revenue Distribution History
          </h2>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="font-bold">
                <th
                  scope="col"
                  className="px-6 font-bold py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                 ID
                </th>
                <th
                  scope="col"
                  className="px-6 font-bold py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Asset ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-bold text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount USDT
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-bold text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-bold text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(revenues) && revenues.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.asset_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t2dt(row.timestamp)}
                  </td>                  
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}