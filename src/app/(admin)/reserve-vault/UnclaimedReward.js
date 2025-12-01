"use client";
import { useState, useEffect } from "react";
import UsersAbi from "@/abi/Users";
import {  USERBOOK_CONTRACT, toEth } from '@/components/const'
import {  readContract } from "@wagmi/core";
import { config } from "../../wagmi";

export default function RevenueVault() {


  const[rewards, setRewards] = useState();
  const[totalUnclaimedReward, setTotalUnclaimedReward] = useState();

  const fetchPendingDues=async()=>{
      const result = await readContract(config, {
        address: USERBOOK_CONTRACT,
        abi: UsersAbi,
        functionName: "getAllRewards"
      });  


      let _totalDues = 0;
      const _holders = result.reduce((acc, row) => {
        const wallet = row.user.toString();
        const amount = toEth(row.dues.toString());
        if (amount > 0) {
          _totalDues += parseFloat(amount);
          acc.push({ amount, wallet });
        }
        return acc;
      }, []);

      setRewards(_holders);   

      setTotalUnclaimedReward(_totalDues);

  }



  useEffect(()=>{
      fetchPendingDues();
  }, [])


  return (
    <div className="p-6  ">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Unclaimed Reward
          </h2>
        </div>
      </div>

      <div className="py-3"> 
        Total Unclaimed Reward 
        : 
        <span className="font-bold text-blue-800 px-2">{totalUnclaimedReward}</span>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User Wallet
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount Due
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(rewards) && rewards.map((item, index) => (
                <tr key={'some_thing_'+index} >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item?.wallet}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    { Math.round(10000*item.amount)/10000}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}