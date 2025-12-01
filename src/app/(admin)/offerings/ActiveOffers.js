"use client";
import { useState, useEffect } from "react";
import EscrowAbi from "@/abi/Escrow";
import {  ESCROW_CONTRACT, toEth, toWei, t2dt, USDT_CONTRACT } from '@/components/const'
import {  readContract, writeContract } from "@wagmi/core";
import { config } from "../../wagmi";
import { useAccount } from "wagmi";
import { erc20Abi } from "viem";


export default function ExpensesHistory() {


 const[expenses, setExpenses] = useState();
 const { address, isConnected } = useAccount();

 const cancelOffer=async(assetId)=>{
      await writeContract(config, {
        address: ESCROW_CONTRACT,
        abi: EscrowAbi,
        functionName: "cancelOffer",
        args: [assetId],
      });      
 }


 const takeOffer=async(offerId)=>{

      let offer = expenses.filter((offer)=>{
        if(offer.id==offerId) return offer;
      });

      offer = offer[0];

      await writeContract(config, {
        address: USDT_CONTRACT,
        abi: erc20Abi,
        functionName: "approve",
        args: [ESCROW_CONTRACT, toWei(offer.price)],
      });  

      await writeContract(config, {
        address: ESCROW_CONTRACT,
        abi: EscrowAbi,
        functionName: "takeOffer",
        args: [offer.id, toWei(offer.amount)],
      });    

 }
 


  const fetchPendingDues=async()=>{
      const result = await readContract(config, 
      {
        address: ESCROW_CONTRACT,
        abi: EscrowAbi,
        functionName: "getMyActiveOffers",
        args:[address]
      });  

      const tokenStandardMap = {
        "0":"ERC20",
        "1":"ERC721",
        "2":"ERC1155",
      }

      const _activeOffers = result.map((row)=>{
        return {
          id:row.offerId.toString(),
          tokenAddress:row.tokenAddress.toString(),
          asset_id:row.asset_id.toString(),
          token_id:row.token_id.toString(),
          token_standard:tokenStandardMap[row.token_standard.toString()],
          amount: toEth(row.tokenAmount.toString()),
          price:toEth(row.usdtValue.toString()),
          timestamp:row.timestamp.toString()
        }
      })
      setExpenses(_activeOffers);
  }


  useEffect(()=>{
    if(isConnected) {
      fetchPendingDues();
    }
  }, [address, isConnected, fetchPendingDues])


  return (
    <div className="p-6  ">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Active Offers
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
                  Tokens Listed
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-bold text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Listed Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-bold text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th> 
                <th
                  scope="col"
                  className="px-6 py-3 font-bold text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cancel
                </th>    
                <th
                  scope="col"
                  className="px-6 py-3 font-bold text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Take Offer
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
                    {
                       item.token_standard=="ERC20" ? (<span>{"ERC20 "+item.amount+" Tokens"} </span>) : null
                    }
                    {
                       item.token_standard=="ERC721" ? (<span>{"ERC721 ID "+item.token_id}</span>) : null
                    }                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price} USDT
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t2dt(item.timestamp)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                        onClick={()=>cancelOffer(item.id)}
                        className="bg-blue-500 px-3 py-1 rounded-lg text-white">Cancel Offer</button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                    <button 
                        onClick={()=>takeOffer(item.id)}
                        className="bg-blue-500 px-3 py-1 rounded-lg text-white">Take Offer</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}