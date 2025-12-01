"use client";

import { useEffect, useState } from "react";
import {  readContract, writeContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import contractABI from "./GovernanceContract.json";
import { GOVERNANCE_CONTRACT } from "./../../../components/const";
import { FaUserShield, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { useAccount } from "wagmi";


export default function AdminAdminsList() 
{
  const {isConnected, address} = useAccount();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Fetch admins from contract
  const getAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await readContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "getAdmins",
        args: [],
      });

      if (Array.isArray(result)) {
        const formatted = result.map((p) => p.toString());
        setAdmins(formatted);
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to fetch admins.");
    } finally {
      setLoading(false);
    }
  };

  const initAdminRevoke = async (proposalAddr) => {
    try {
      const txHash = await writeContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "initAdminRevoke",
        args: [proposalAddr],
      });

      console.log("Transaction sent:", txHash);
      alert(`Transaction sent: ${txHash}`);
      // Re-fetch admins after approval
      getAdmins();
    } catch (err) {
      console.error("Error executing revoke:", err);
      setError("Failed to revoke admin.");
    }
  };

  // Fetch admins when component mounts
  useEffect(() => {
    if (isConnected) {
      getAdmins();
    }
  }, [isConnected, address]);

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between pb-5">
        <h1 className="text-2xl text-gray-800 font-bold flex gap-2">
          <FaUserShield className="text-indigo-600" />
          Current Admins
        </h1>
        <button
          onClick={getAdmins}
          disabled={loading}
          className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            "Refresh List"
          )}
        </button>
      </div>

      {loading && (
        <div className="text-center text-indigo-500 text-lg flex items-center justify-center gap-2">
          <FaSpinner className="animate-spin" />
          <span>Loading admins...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
          <FaExclamationCircle className="mr-2 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && admins.length === 0 && (
        <div className="flex items-center justify-center p-6 bg-yellow-100 text-yellow-700 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold">No admins found.</p>
        </div>
      )}

      {!loading && !error && admins.length > 0 && (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-gray-200">
              <tr className="border-b border-gray-300">
                <th className="p-4 font-semibold text-gray-700">#</th>
                <th className="p-4 font-semibold text-gray-700">Admin Address</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((newAdmin, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-4 text-gray-600 font-medium">{index + 1}</td>
                  <td className="p-4 font-mono text-sm text-gray-700 truncate max-w-xs">
                    {newAdmin}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md"
                      onClick={() => initAdminRevoke(newAdmin)}
                    >
                      Init Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}