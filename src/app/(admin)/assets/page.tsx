'use client';
import Sheet from "@/components/Sheet";
import React, { useEffect } from 'react';
import { useState } from "react";
import From from "./Form";
import View from "./View";
import useAssetsStore from "@/stores/assetsStore";
import { apiUrl, getData } from "@/components/utils";
import Link from "next/link"
import { FaMoneyBill } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { MdLocalOffer } from "react-icons/md";

export default function TokenizeAssetForm() {

    const[showSheet, setShowSheet] = useState(false);
    const[sheet, setSheet] = useState({title:"Add New Asset", form:(<From onClose={()=>setShowSheet(false)} />)});
    const { assets, fetchAssets } = useAssetsStore();

    const refreshAssetInformation=async(id:number)=>{
        await getData('/api/assets/sync?id='+id);
        fetchAssets();
    }

    useEffect(()=> {
      fetchAssets()
    }, [fetchAssets]);


    return (
        
        <div className="w-full px-4 py-5 md:px-10 ">

            <Sheet title={sheet.title} show={showSheet} onClose={()=>setShowSheet(false)}>
              {sheet.form}
            </Sheet>
            
            <div className="flex justify-content items-center pb-5 space-between">
                <div>
                    <h2 className="text-2xl font-bold">Assets Tokenization</h2>
                </div>
                <div className="flex-1"></div>
                <div>
                    <button className="font-bold bg-blue-600 text-white px-3 py-2 rounded" onClick={()=> { 
                      setShowSheet(true);
                      setSheet({title:"Add New Asset", form:(<From onClose={()=>setShowSheet(false)} />)});
                    }}>Add New</button>
                </div>
            </div>


   <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Logo</th>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Asset Name, Symbol</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Total Supply</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Active</th>           
            <th className="px-4 py-3 text-left">Refresh</th>
            <th className="px-4 py-3 text-left">Detail</th>
            <th className="px-4 py-3 text-left">Create Offer</th>
            <th className="px-4 py-3 text-left">Operation Charges</th>
            <th className="px-4 py-3 text-left">Deposit Revenue</th>
            

          </tr>
        </thead>
        <tbody className="text-gray-800 text-sm">
          {Array.isArray(assets) && assets.map((asset) => (
            <tr key={asset?.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-1 py-1">
                <img src={apiUrl+"/uploads/"+asset?.token_icon} alt={`${asset?.name} logo`} 
                     className="h-12 w-12 rounded-full" />
              </td>
              <td className="px-4 py-2">{asset?.id}</td>
              <td className="px-4 py-2">{asset?.asset_name} ({asset?.token_symbol})</td>
              <td className="px-4 py-2">{asset?.token_standard}</td>
              <td className="px-4 py-2">{asset?.total_supply}</td>
              <td className="px-4 py-2">
                <span className=" px-3 capitalize">{asset?.status}</span>
              </td>            
              
              <td className="px-4 py-2 text-blue-800">
                {
                  asset.status=="init" ? (<Link href={"/asset-submit?id="+asset?.id}>Submit</Link>) : null
                }                
              </td>

              <td className="px-4 py-2">


                <button 
                  onClick={()=>refreshAssetInformation(asset.id)}
                  className="border border-1 border-blue-300 mr-2 px-3 py-2 rounded text-xs">
                  Refresh
                </button>

                {
                   asset.status=="init" ? 
                (<button 
                  onClick={()=>{
                      setSheet({
                        title:"Update Asset",
                        form:<View asset={asset} onClose={()=>setShowSheet(false)} />
                      })
                      setShowSheet(true);
                  }}
                  className="text-white bg-green-600  px-3 py-2 rounded text-xs">
                  Update
                </button>) :   null
                }
              </td>

              <td className="px-6 py-2 text-blue-800">
                    <Link href={"/asset-detail?id="+asset?.id}>View</Link>          
              </td>  
              <td className="px-6 text-xl text-center py-2 text-blue-500">
                {
                  asset?.status=="Approved" ? (
                  <Link 
                      title="Create Offer"
                      href={"/offerings?id="+asset?.id}>
                      <MdLocalOffer />
                  </Link> ) : <>-</>
                }                
              </td>  

              <td className="px-6 text-xl text-center py-2 text-blue-500">
                {
                  asset?.status=="Approved" ? (
                  <Link 
                    title="Operation Charges"
                    href={"/operation-charges?id="+asset?.id}>
                    <FaMoneyBill />
                  </Link> ) : <>-</>
                }                 
              </td>           

              <td className="px-6 text-xl text-center  py-2 text-blue-500">
                {
                  asset?.status=="Approved" ? (
                  <Link 
                      title="Distribute Revenue"
                      className="inline" href={"/reserve-vault?id="+asset?.id}>
                      <FaMoneyCheckDollar className="inline" />
                  </Link> ) : <>-</>
                }                  
              </td>  

            </tr>
          ))}
        </tbody>
      </table>
    </div>



        </div>
    );
}
