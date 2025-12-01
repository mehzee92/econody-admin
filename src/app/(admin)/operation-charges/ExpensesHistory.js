"use client";
import { useState, useEffect } from "react";
import OperationsAbi from "@/abi/Operations";
import {  OPERATIONS_CONTRACT, toEth, t2dt } from '@/components/const'
import {  readContract } from "@wagmi/core";
import { config } from "../../wagmi";


export default function ExpensesHistory() {


 const[expenses, setExpenses] = useState();

  const fetchPendingDues=async()=>{
      const result = await readContract(config, {
        address: OPERATIONS_CONTRACT,
        abi: OperationsAbi,
        functionName: "getLastTwentyExpenses",
      });  

      const _expenses = result.map((row)=>{
        return {
          id:row.id.toString(),
          asset_id:row.asset_id.toString(),
          amount: Math.round(10000*toEth(row.amount.toString()))/10000,
          description:row.description.toString(),
          timestamp:row.timestamp.toString()
        }
      })
      setExpenses(_expenses);
  }


  useEffect(()=>{
      fetchPendingDues();
  }, [])


  return (
    <div className="p-6  ">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Expenses History
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
              {Array.isArray(expenses) && expenses.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.asset_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t2dt(item.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}