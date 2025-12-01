"use client";

import { useState } from "react";
import { writeContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import contractABI from "./GovernanceContract.json";
import { GOVERNANCE_CONTRACT } from "./../../../components/const";
import { FaUserPlus, FaCheckCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useAccount } from "wagmi";



export default function AdminProposalForm() 
{
  const { isConnected, } = useAccount();
  const [newAdmin, setNewAdmin] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  // Initiate Admin Proposal
  const initToAdmin = async () => {
    if (!newAdmin || !newAdmin.startsWith("0x") || newAdmin.length !== 42) {
      setError("Please enter a valid Ethereum address (e.g., 0x...).");
      setSuccess(false);
      return;
    }
    
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const txHash = await writeContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "initToAdmin",
        args: [newAdmin],
      });

      console.log("Transaction sent:", txHash);
      setSuccess(true);
      setNewAdmin(""); // reset input
    } catch (err) {
      console.error("Error executing initToAdmin:", err);
      setError("Failed to initiate admin proposal. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between pb-5">
        
        <h1 className="text-2xl text-gray-800 font-bold flex gap-2">
          <FaUserPlus className="text-4xl text-green-600 mr-3" />
          Propose New Admin
        </h1>
        <div></div>
      </div>

      <p className="text-gray-600 mb-6">
        Enter the address of the user you want to propose as a new admin.
        <br />
        Only admin can initiate to add a new admin.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <input
          type="text"
          placeholder="0xAdminAddress..."
          value={newAdmin}
          onChange={(e) => setNewAdmin(e.target.value)}
          className="flex-1 border-2 border-gray-300 rounded-xl px-5 py-3 text-gray-800 focus:outline-none focus:ring-4 focus:ring-green-200 transition-shadow"
        />
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg hover:bg-green-600 transition-colors duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={initToAdmin}
          disabled={!isConnected}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              Proposing...
            </span>
          ) : (
            "Propose Admin"
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
          <FaExclamationCircle className="mr-2 text-red-500" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">
          <FaCheckCircle className="mr-2 text-green-500" />
          <p className="text-sm font-medium">Proposal initiated successfully!</p>
        </div>
      )}
    </div>
  );
}