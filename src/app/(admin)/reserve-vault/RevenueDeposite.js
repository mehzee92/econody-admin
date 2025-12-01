"use client";
import { useEffect, useState } from "react";
import {  readContract, writeContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import RWAFactory from "@/abi/RWAFactory";
import ReserveVault from "@/abi/ReserveVault";

import {  RWA_FACTORY_CONTRACT, RESERVE_VAULT, USDT_CONTRACT, toWei } from '@/components/const'
import { erc20Abi } from "viem";
import { apiUrl } from "@/components/utils";


export default function RevenueVault() {

  const[holders, setHolders] = useState();
  const[totalSupply, setTotalSupply] = useState(0);
  const[totalReward, setTotalReward] = useState(0);
  const[assetId, setAssetId] = useState(0);
  const[description, setDescription] = useState("");
  const[data, setData] = useState();

  function toEth(wei) {
    return Number(wei) / 1e18;
  }


  const fetchAssetDetail=async(assetId)=>{
      const url =  apiUrl+"/api/assets/"+assetId;
      const response = await fetch(url);
      const _data = await response.json();
      setData({..._data});
      return _data;
  }  


  const fetchHolders=async(assetId)=>{
      const _data = await fetchAssetDetail(assetId);
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = await readContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAFactory,
        functionName: "getShareHolders",
        args:[assetId]
      });  
      
      let supply = 0;
      const _holders = result.map((row)=>{
        let _amount = Math.round(100000*toEth(row.b.toString()))/100000;
        if(_data.token_standard=="ERC721") 
        {
            _amount = Math.round(1000*toEth(row.b.toString()+"000000000000000000"))/1000; 
        }

        supply += _amount;
        return {
          holder:row.h.toString(),
          amount:_amount
        }
      })
      setTimeout(()=>{
        setHolders(_holders);
        setTotalSupply(supply);
      }, 1); 

  }


  const depositeRevenue=async()=>
  {
      const txHash1 = await writeContract(config, {
        address: USDT_CONTRACT,
        abi: erc20Abi,
        functionName: "approve",
        args: [RESERVE_VAULT, toWei(totalReward)],
      }); 

      alert("Approval Tx hash : "+txHash1);

      const _holders = holders.map((row)=>row.holder);
      const _amounts = holders.map((row)=>toWei((Math.round(row.amount/totalSupply)*totalReward)));

      const txHash = await writeContract(config, {
        address: RESERVE_VAULT,
        abi: ReserveVault,
        functionName: "depositReward",
        args: [_holders, _amounts, assetId, description],
      }); 

      alert("Deposit Reward Tx hash : "+txHash)
      
  }

  

  useEffect(() => {
      const url = window.location.href;
      const params = new URLSearchParams(new URL(url).search);
      const _id = params.get("id");
      if (_id) {
          setAssetId(_id);
          fetchHolders(_id);
      }
  }, []);   


  return (
    <div className="p-6 flex ">

    <div className="max-w-sm pr-2">

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Deposit Revenue 
          </h2>
      </div>

      <div className="pt-2 w-80">
          <div className="py-2">
            <label htmlFor="asset-code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Asset ID
            </label>
            <div className="flex gap-2">
              <input
                id="asset-code"
                name="asset-code"
                type="number"
                value={assetId}
                onChange={(e)=>setAssetId(e.target.value)}
                placeholder="2323"
                className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
              <button
                onClick={()=>fetchHolders(assetId)}
                className="block w-60 h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                Fetch Holders
                </button>                
              </div>
          </div>


          <div className="text-blue-600 py-3">
             <div>{data?.asset_name}
                ({data?.token_standard})
                {data?.token_standard=="ERC721" ? ", ID:"+data?.token_id : null }
              </div>
          </div>


          <div className="py-2">
            <label htmlFor="amount-usdt"
              className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USDT)
            </label>
            <input
              onChange={(e)=>setTotalReward(e.target.value)}
              id="amount-usdt"
              name="amount-usdt"
              type="number"
              placeholder="e.g., 500.00"
              className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>



          <div className="py-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder="e.g., Q3 project sales"
              className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>



          <br />
          <br />

          <button
            onClick={depositeRevenue}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Deposit Revenue
          </button>
      </div>
    </div>


    <div className="px-3 flex-1">

        <div className="" style={{maxHeight:"600px", overflowY:"scroll"}}>
            
            <h2 className="text-xl font-bold">Token Holders Detail</h2>
            <div className="grid grid-cols-3 gap-4 bg-gray-200 font-bold gap-2 py-2 border-1 border-gray-200 px-1">
                <div className="flex-1 px-2 ">Wallet</div>
                <div className="pl-2 px-2">Holding Tokens</div>
                <div className="pl-2 px-2">Reward Share</div>
            </div>

            {
            Array.isArray(holders) && holders.map((row, index)=>{
                    return (
                        <div key={"some_"+index} className="grid grid-cols-3 gap-4 gap-2 py-2 border-1 border-gray-200 px-1">
                            <div className="flex-1 px-2 ">{row.holder.slice(0, 6)}...{row.holder.slice(36, 42)}</div>
                            <div className="pl-2 px-2">{row.amount}</div>
                            <div className="pl-2 px-2">{Math.round((row.amount/totalSupply)*totalReward)}</div>
                        </div>
                    )
                })
            }

            {
            !Array.isArray(holders) && (
                        <div className="text-center gap-2 py-3 px-1">
                            Enter Asset Id, then press fetch Holders button to load holders.
                        </div>
                    )
            }            

        </div>
        
    </div>

    </div>
  );
}