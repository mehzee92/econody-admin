"use client";
import { useState, useEffect } from "react";
import { writeContract, readContract } from "@wagmi/core";
import { useAccount } from "wagmi";
import { config } from "../../wagmi";
import EscrowAbi from "@/abi/Escrow";
import Erc721Abi from "@/abi/erc721Abi";
import Erc1155Abi from "@/abi/erc1155Abi";

import {  ESCROW_CONTRACT,  toWei, toEth } from '@/components/const'
import { erc20Abi } from "viem";
import { apiUrl } from "@/components/utils";


const Detail=({label, value})=>(<div className="py-1 bg-gray-100 px-2 my-2 rounded grid grid-cols-3">
      <div>{label}</div> 
      <div className="px-4 col-span-2 font-bold">{value}</div>
  </div>)


export default function CreateOffer() 
{
  const { isConnected, address} = useAccount();
  const[tokenAddress, setTokenAddress] = useState("");
  const[tokenAmount, setTokenAmount] = useState(0);
  const[usdtAmount,  setUsdtAmount] = useState(0);
  const[assetId,  setAssetId] = useState(0);
  const[balance,  setBalance] = useState(0.0);
  const[data,  setData] = useState();


  const fetchData=async(_assetId)=>{
      const url = apiUrl+"/api/assets/asset-detail?id="+_assetId;
      const resp = await fetch(url);
      const data = await resp.json();
      setTokenAddress(data.token_address);
      setData(data);
      updateBalance(data.token_standard, data.token_address);
  }

  const getERC20Balance=async(_tokenAddress)=>{
    const result = await readContract(config, {
          address: _tokenAddress,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(toEth(result));
  }  


  const getERC1155Balance=async()=>{
    const result = await readContract(config, {
          address: tokenAddress,
          abi: Erc1155Abi,
          functionName: "balanceOf",
          args: [address, data?.token_id],
        });
        setBalance(toEth(result));
  } 

  const getOwnerOf=async()=>{
    const result = await readContract(config, {
          address: tokenAddress,
          abi: Erc721Abi,
          functionName: "ownerOf",
          args: [data?.token_id],
        });
        setBalance(result);
  }  




 const updateBalance=(standard, tokenAddress)=>{
    switch (standard) {
      case "ERC20":
        getERC20Balance(tokenAddress);
        break;

      case "ERC721":
        getOwnerOf(tokenAddress);
        break;

      case "ERC1155":
        getERC1155Balance(tokenAddress);
        break;

      default:
        console.warn("Unsupported token standard:", standard);
        break;
    }  
 }


  const createOffer=async()=>
  {
      if(usdtAmount==0) {
        alert("USDT Amount must be more than zero.");
        return;
      }

      if(tokenAmount==0 && data.token_standard=='ERC20') 
      {
        alert("Token Amount must be more than zero.");
        return;
      }      

      if(parseInt(tokenAmount)>parseInt(balance) && data.token_standard=='ERC20') 
      {
        alert("Token Amount must be less than balance.");
        // alert(JSON.stringify({tokenAmount, balance}));
        return;
      }

      const tokenId = data.token_id; 
      if(data.token_standard=="ERC20")
      {
          await writeContract(config, {
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [ESCROW_CONTRACT, toWei(tokenAmount)],
        });
      }
      
      if(data.token_standard=="ERC721")
      {
        await writeContract(config, {
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [ESCROW_CONTRACT, tokenId],
        });
      }
      
      let tokenStandard  =  0;

      if(data.token_standard=="ERC721")
      {
        tokenStandard  =  1;
      }

      if(data.token_standard=="ERC1155")
      {
        tokenStandard  =  2;
      }

      await writeContract(config, {
        address: ESCROW_CONTRACT,
        abi: EscrowAbi,
        functionName: "createOffer",
        args: [
          tokenAddress, 
          toWei(tokenAmount), 
          toWei(usdtAmount), 
          assetId, 
          tokenId, 
          tokenStandard]
      });  
      setBalance(balance-tokenAmount);
  }

  useEffect(() => {
      const url = window.location.href;
      const params = new URLSearchParams(new URL(url).search);
      const _id = params.get("id");
      if (_id) {
          setAssetId(_id);
          fetchData(_id);
      }
  }, []); 



useEffect(() => 
  {
    if (!isConnected) return;
    if (!tokenAddress || tokenAddress.length < 40) return;
    const standard = data?.token_standard;
    updateBalance(standard, data?.token_address);
  }, 
[address, tokenAddress]);

  return (
    <div className=" py-2 ">

      <h2 className="text-3xl px-5 py-4 font-extrabold text-gray-900 leading-tight">
          Create Offer
      </h2>

    <div className="p-6 flex  ">
      <div className="px-5 bg-blue-50  max-w-lg w-full py-5 rounded-lg">

          <div className="flex gap-3">
            <div className="py-2 flex-1">
              <label htmlFor="asset-code"
                className="block text-sm font-medium text-gray-700 mb-1">
                Asset ID
              </label>
              <div className="flex gap-2">
                    <input
                      type="text"
                      value={assetId}
                      onChange={(e)=>setAssetId(e.target.value)}
                      placeholder="0x0"
                      className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />            
                </div>
            </div>

            <div className="items-center flex ">
                <button 
                  onClick={()=>fetchData(assetId)}
                  className="border  border-1 mt-6 border-gray-800 font-bold rounded-lg px-5 py-3 text-gray-800">
                    Fetch Detail
                </button>
            </div>
          </div>


          <div className="py-2">
              <label htmlFor="asset-code"
                className="block text-sm font-medium text-gray-700 mb-1">
                Token Name
              </label>
              <div className="flex gap-2">
                    <input
                      type="text"
                      value={data?.asset_name || ""}
                      onChange={()=>{}}
                      className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />            
                </div>
          </div>  


          <div className="flex gap-4">
            <div className="py-2">
              <label htmlFor="asset-code"
                className="block text-sm font-medium text-gray-700 mb-1">
                Token Type
              </label>
              <div className="flex gap-2">
                    <input
                      type="text"
                      value={data?.token_standard || ""}
                      onChange={()=>{}}
                      placeholder="0x0"
                      className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />            
                </div>
            </div>



            <div className="py-2">
              <label htmlFor="asset-code"
                className="block text-sm font-medium text-gray-700 mb-1">
                Token Symbol
              </label>
              <div className="flex gap-2">
                    <input
                      type="text"
                      value={data?.token_symbol || ""}
                      onChange={()=>{}}
                      placeholder="0x0"
                      className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />            
                </div>
            </div>  



          </div>         




            <div className="py-2 ">
              <label htmlFor="asset-code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Token Address
              </label>
              <div className="flex gap-2">
                <input
                  id="asset-code"
                  name="asset-code"
                  type="text"
                  value={tokenAddress}
                  onChange={()=>setTokenAddress(data?.token_address)}
                  placeholder="0x0"
                  className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />            
                </div>
            </div>

            <div className="flex gap-4"> 

            {
              (data?.token_standard=="ERC20" || data?.token_standard=="ERC1155") && (
                <div className="py-2 flex-1">
                  <label htmlFor="amount-usdt"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Token Amount ({data?.token_standard})
                  </label>
                  <input
                    onChange={(e)=>setTokenAmount(e.target.value)}
                    value={tokenAmount}
                    max={balance}
                    type="number"
                    placeholder="e.g., 500.00"
                    className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              )
            }

            {
              (data?.token_standard=="ERC721" || data?.token_standard=="ERC1155") && (
                <div className="py-2 2 flex-1">
                  <label htmlFor="amount-usdt"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Token ID
                  </label>
                  <input
                    onChange={()=>setTokenId(data.token_id)}
                    value={data.token_id}
                    placeholder="e.g., 500.00"
                    className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              )
            }
          </div>


            <div className="py-2 2 flex-1">
              <label htmlFor="amount-usdt"
                className="block text-sm font-medium text-gray-700 mb-1">
                Price in USDT
              </label>
              <input
                onChange={(e)=>setUsdtAmount(e.target.value)}
                value={usdtAmount}
                type="number"
                placeholder="e.g., 500.00"
                className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>



            <br />

          <div className="flex flex justify-end ">
              
              {
                (data?.token_standard=="ERC20" || data?.token_standard=="ERC1155")  && (<div className="flex-1 flex items-center">
                  <span>Balance: {balance}</span>
                </div>)
              }

              {
                data?.token_standard=="ERC721" && (<div className="flex-1 flex items-center">
                  <span>{balance==address ? <span className="text-green-600">You are owner of Token ID : {data.token_id}</span>  : <span className="text-red-600">You are not owner of this Token ID</span>  }</span>
                </div>)
              }


              <button
                onClick={createOffer} type="submit" 
                className="w-40  py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                Create Offer
              </button>
          </div>

      </div>



      <div className="px-3 flex-1">
        {data && (<div>
            <Detail label="Asset Id" value={data.id} />
            <Detail label="Asset Name" value={data.asset_name} />
            <Detail label="Asset Symbol" value={data.token_symbol} />
            <Detail label="Token Standard" value={data.token_standard} />
            <Detail label="Total Supply" value={data.total_supply} />
            <Detail label="Token Address" value={data.token_address.slice(0, 10)+"..."+data.token_address.slice(32, 42)} />
            <Detail label="Token ID" value={data.token_id} />
            <Detail label="Category" value={data.category} />
            <Detail label="Token URI" value={data.token_uri} />
            <Detail label="Listing Title" value={data.title} />
            <Detail label="Description" value={data.description} />
        </div>)}
        
      </div>
     </div>
    </div>

  );
}