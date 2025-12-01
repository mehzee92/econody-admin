"use client"
import { apiUrl } from "@/components/utils";
import { useEffect, useState } from "react";


function Page() 
{
    const[address,] = useState();
    const[detail, setDetail] =  useState()

    const fetchAssetDetail=async(id)=>{
        const url = apiUrl+"/api/assets/asset-detail?id="+id;
        const response = await fetch(url);
        const data = await response.json();
        setDetail(data);
        alert(JSON.stringify(data));
    }


    useEffect(()=>{
        const url = window.location.href;
        const params = new URLSearchParams(new URL(url).search);
        const _id = params.get("id"); 
        fetchAssetDetail(_id);
    }, [])


    return(
        <div className="px-5 py-4">
            <h1 className="text-2xl py-2">Token Details</h1>
            <div>Address : {address}</div>
            <div>Token Name : {detail?.name}</div>
            <div>Total Supply : {detail?.totalSupply}</div>
             <div>Owner : {detail?.owner}</div>
             <br />

             <h1 className="text-2xl py-2">Holders</h1>

             <div className="grid grid-cols-3 font-bold">
                <div className="w-60">Ser</div>
                <div>Address</div>
                <div>Balance</div>
            </div>
             <div className="grid grid-cols-3">
                <div className="w-42">1.</div>
                <div>0x383745734985398538953985389</div>
                <div>121000</div>
            </div>
             <div className="grid grid-cols-3">
                <div className="w-60">2.</div>
                <div>0x383745734985398538953985389</div>
                <div>121000</div>
            </div>
             <div className="grid grid-cols-3">
                <div className="w-42">3.</div>
                <div>0x383745734985398538953985389</div>
                <div>121000</div>
            </div>                        
        </div>
    )
}


export default Page;