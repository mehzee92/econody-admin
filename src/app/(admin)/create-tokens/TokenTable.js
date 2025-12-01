"use client"
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import RWAAbi from "./RWAAbi.json";
import { RWA_FACTORY_CONTRACT } from "./../../../components/const";
import Link from "next/link"


const TokensTable = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deployedTokens, setDeployedTokens] = useState();

  const getAllDeployedTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await readContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAAbi,
        functionName: "getAllDeployedTokens",
      });
      
      const standards = {
        "0":"ERC20",
        "1":"ERC721",
        "2":"ERC1155"
      };

      const resultFormated = result.map((row)=>{
         return {
            contractAddress: row.contractAddress.toString(),
            name: row.name.toString(),
            standard: standards[row.standard.toString()]
        }
      })
      setDeployedTokens(resultFormated);
    } 
    catch (err) 
    {
      console.error("Error submitting asset:", err);
      setError("Failed to submit asset info.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getAllDeployedTokens();
  }, []);



//   if (loading) {
//     return <p className="text-gray-500">Fetching fresh list</p>;
//   }

//   if (!deployedTokens || deployedTokens.length === 0) {
//     return <p className="text-gray-500">No tokens to display.</p>;
//   }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <div className="text-right">
        <button 
            className="border rounded-3xl border-1 text-gray-500 border-gray-200 text-center w-28 px-3 my-1 py-1"
            onClick={getAllDeployedTokens}>{loading ? "Loading..." : "Refresh"}</button>
      </div>
      
      <div>{error}</div>

      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
            <th className="py-3 px-6 border-b border-gray-200">Contract Address</th>
            <th className="py-3 px-6 border-b border-gray-200">Name</th>
            <th className="py-3 px-6 border-b border-gray-200">Standard</th>
            <th className="py-3 px-6 border-b border-gray-200">Detail</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr className="hover:bg-gray-50">
            <td  className="py-3 px-6 border-b border-gray-200 text-gray-900 font-bold text-sm"
                colSpan={3}>Fetching fresh list.....</td>
          </tr> : null }
          {!loading && Array.isArray(deployedTokens) && deployedTokens.map((token, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-3 px-6 border-b border-gray-200 text-gray-800 font-mono text-sm">{token.contractAddress}</td>
              <td className="py-3 px-6 border-b border-gray-200 text-gray-800">{token.name}</td>
              <td className="py-3 px-6 border-b border-gray-200 text-gray-800">{token.standard}</td>
              <td className="py-3 px-6 border-b border-gray-200 text-gray-800">
                <Link href={"/token-detail?address="+token.contractAddress} className="text-blue-400">View Detail</Link>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokensTable;