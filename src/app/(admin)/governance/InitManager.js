"use client";

import { useEffect, useState } from "react";
import { getAccount, writeContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import contractABI from "./GovernanceContract.json";
import { GOVERNANCE_CONTRACT } from "./../../../components/const";
import { FaUserTag, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

export default function InitManager() {
  const [isConnected, setIsConnected] = useState(false);
  const [newManager, setNewManager] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch account info (wagmi core)
  useEffect(() => {
    const acc = getAccount(config);
    setIsConnected(!!acc.address);
  }, []);

  // Initiate Manager Proposal
  const initAddManager = async () => {
    if (!newManager || !newManager.startsWith("0x") || newManager.length !== 42) {
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
        functionName: "initAddManager",
        args: [newManager],
      });

      console.log("Transaction sent:", txHash);
      setSuccess(true);
      setNewManager(""); // reset input
    } catch (err) {
      console.error("Error executing initAddManager:", err);
      setError("Failed to initiate manager proposal. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between pb-5">
        <h1 className="text-2xl text-gray-800 font-bold flex gap-2">
          <FaUserTag className="text-4xl text-blue-600 mr-3" />
          Propose New Manager
        </h1>
        <div></div>
      </div>
      
      <p className="text-gray-600 mb-6">
        Enter the address of the user you want to propose as a new Manager.
        <br />
        Only admin can initiate to add a new admin.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <input
          type="text"
          placeholder="0xManagerAddress..."
          value={newManager}
          onChange={(e) => setNewManager(e.target.value)}
          className="flex-1 border-2 border-gray-300 rounded-xl px-5 py-3 text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-shadow"
        />
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={initAddManager}
          disabled={loading || !isConnected}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              Proposing...
            </span>
          ) : (
            "Propose Manager"
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