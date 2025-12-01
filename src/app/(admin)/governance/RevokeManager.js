"use client";

import { useEffect, useState } from "react";
import { getAccount, readContract, writeContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import contractABI from "./GovernanceContract.json";
import { GOVERNANCE_CONTRACT } from "./../../../components/const";
import { FaUserTimes, FaCheckCircle, FaTimesCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

export default function ManagerRevokeProposalsList() 
{
  
  const [isConnected, setIsConnected] = useState(false);
  const [managerRevokeProposals, setManagerRevokeProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch account info (wagmi core)
  useEffect(() => {
    const acc = getAccount(config);
    setIsConnected(!!acc.address);
  }, []);

  // Fetch manager revoke proposals from contract
  const fetchManagerRevokeProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await readContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "getPendingManagerRevokeProposals",
        args: [],
      });

      if (Array.isArray(result)) {
        const formatted = result.map((p) => p.toString());
        setManagerRevokeProposals(formatted);
      } else {
        setManagerRevokeProposals([]);
      }
    } catch (err) {
      console.error("Error fetching manager revoke proposals:", err);
      setError("Failed to fetch manager revoke proposals.");
    } finally {
      setLoading(false);
    }
  };

  const approveRevokeManager = async (proposalAddr) => {
    try {
      const txHash = await writeContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "approveRevokeManager",
        args: [proposalAddr],
      });

      console.log("Transaction sent:", txHash);
      alert(`Approval transaction sent: ${txHash}`);
      // Re-fetch proposals after approval
      fetchManagerRevokeProposals();
    } catch (err) {
      console.error("Error executing approveRevokeManager:", err);
      setError("Failed to approve proposal.");
    }
  };

  const cancelManagerRevokeProposal = async (proposalAddr) => {
    try {
      const txHash = await writeContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "cancelManagerRevokeProposal",
        args: [proposalAddr],
      });
      console.log("Transaction sent:", txHash);
      alert(`Cancellation transaction sent: ${txHash}`);
      // Re-fetch proposals after cancellation
      fetchManagerRevokeProposals();
    } catch (err) {
      console.error("Error executing cancelManagerRevokeProposal:", err);
      setError("Failed to cancel proposal.");
    }
  };

  // Fetch proposals when component mounts
  useEffect(() => {
    if (isConnected) {
      fetchManagerRevokeProposals();
    }
  }, [isConnected]);

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between pb-5">
        <h1 className="text-2xl text-gray-800 font-bold flex gap-2">
          <FaUserTimes className="text-purple-600" />
          Proposals : Revoke Existing Manager
        </h1>
        <button
          onClick={fetchManagerRevokeProposals}
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
        <div className="text-center text-purple-500 text-lg flex items-center justify-center gap-2">
          <FaSpinner className="animate-spin" />
          <span>Loading proposals...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
          <FaExclamationCircle className="mr-2 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && managerRevokeProposals.length === 0 && (
        <div className="flex items-center justify-center p-6 bg-yellow-100 text-yellow-700 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold">No pending manager revoke proposals found.</p>
        </div>
      )}

      {!loading && !error && managerRevokeProposals.length > 0 && (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-gray-200">
              <tr className="border-b border-gray-300">
                <th className="p-4 font-semibold text-gray-700">#</th>
                <th className="p-4 font-semibold text-gray-700">Proposed Manager to Revoke</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managerRevokeProposals.map((proposalAddr, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-4 text-gray-600 font-medium">{index + 1}</td>
                  <td className="p-4 font-mono text-sm text-gray-700 truncate max-w-xs">
                    {proposalAddr}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md flex items-center gap-1"
                        onClick={() => approveRevokeManager(proposalAddr)}
                      >
                        <FaCheckCircle />
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md flex items-center gap-1"
                        onClick={() => cancelManagerRevokeProposal(proposalAddr)}
                      >
                        <FaTimesCircle />
                        Cancel
                      </button>
                    </div>
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