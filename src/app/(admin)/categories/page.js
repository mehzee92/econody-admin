'use client';
import Sheet from "@/components/Sheet";
import { useState } from "react";
import From from "./Form";
import View from "./View";
import useCategoriesStore from "@/stores/categories";
import { apiUrl } from "@/components/utils";

export default function TokenizeAssetForm() {

    const[showSheet, setShowSheet] = useState(false);
    const[sheet, setSheet] = useState({title:"Add New Category", form:(<From onClose={()=>setShowSheet(false)} />)});
    const { categories } = useCategoriesStore();

    // useEffect(()=> {
    //   fetchAssets()
    // }, []);


    return (
        
        <div className="w-full px-4 py-5 md:px-10 ">

            <Sheet title={sheet.title} show={showSheet} onClose={()=>setShowSheet(false)}>
              {sheet.form}
            </Sheet>
            <div className="flex justify-content items-center pb-5 space-between">
                <div>
                    <h2 className="text-2xl font-bold">Categories</h2>
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
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Category Name</th>
            <th className="px-4 py-3 text-left">Symbol</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 text-sm">
          {categories.map((asset) => (
            <tr key={asset?.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-1 py-1">
                <img src={apiUrl+"/uploads/"+asset?.token_icon} alt={`${asset?.name} logo`} 
                     className="h-12 w-12 rounded-full" />
              </td>
              <td className="px-4 py-2">{asset?.id}</td>
              <td className="px-4 py-2">{asset?.asset_name}</td>
              <td className="px-4 py-2">{asset?.token_symbol}</td>
              <td className="px-4 py-2">{asset?.total_supply}</td>
              <td className="px-4 py-2 font-mono">{asset?.destination_wallet.slice(0, 8)}...{asset?.destination_wallet.slice(asset?.destination_wallet.length-8, asset?.destination_wallet.length)}</td>
              <td className="px-4 py-2 text-blue-800">
                <span className=" px-3 capitalize">{asset?.status}</span>
                <span className=" px-3">{asset?.is_listed ? 'Listed' : '' }</span>
              </td>            
              
              <td className="px-4 py-2">
                <button 
                  onClick={()=>{
                      setSheet({
                        title:"Update Asset",
                        form:<View asset={asset} onClose={()=>setShowSheet(false)} />
                      })
                      setShowSheet(true);
                  }}
                  className="text-white bg-green-600  px-3 py-2 rounded text-xs">
                  Update
                </button>
              </td>            
            </tr>
          ))}
        </tbody>
      </table>
    </div>



        </div>
    );
}
