"use client";

import { useEffect, useState } from "react";
import { getAccount, readContract, writeContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import contractABI from "./GovernanceContract.json";
import { GOVERNANCE_CONTRACT } from "./../../../components/const";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

export default function AdminProposalsList() {
  const [isConnected, setIsConnected] = useState(false);
  const [adminProposals, setAdminProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch account info (wagmi core)
  useEffect(() => {
    const acc = getAccount(config);
    setIsConnected(!!acc.address);
  }, []);

  // Fetch admin proposals from contract
  const fetchAdminProposals = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await readContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "getPendingAdminProposals",
        args: [],
      });

      if (Array.isArray(result)) {
        const formatted = result.map((p) => p.toString());
        setAdminProposals(formatted);
      } else {
        setAdminProposals([]);
      }
    } catch (err) {
      console.error("Error fetching admin proposals:", err);
      setError("Failed to fetch admin proposals.");
    } finally {
      setLoading(false);
    }
  };

  // Approve admin proposal
  const approveAdmin = async (proposalAddr) => {
    try {
      const txHash = await writeContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "approveAdmin",
        args: [proposalAddr],
      });

      console.log("Transaction sent:", txHash);
      alert(`Approval transaction sent: ${txHash}`);
      // Re-fetch proposals after approval
      fetchAdminProposals();
    } catch (err) {
      console.error("Error executing approveAdmin:", err);
      setError("Failed to approve proposal.");
    }
  };

  // Cancel admin proposal
  const cancelAdminProposal = async (proposalAddr) => {
    try {
      const txHash = await writeContract(config, {
        address: GOVERNANCE_CONTRACT,
        abi: contractABI,
        functionName: "cancelAdminProposal",
        args: [proposalAddr],
      });

      console.log("Transaction sent:", txHash);
      alert(`Cancellation transaction sent: ${txHash}`);
      // Re-fetch proposals after cancellation
      fetchAdminProposals();
    } catch (err) {
      console.error("Error executing cancelAdminProposal:", err);
      setError("Failed to cancel proposal.");
    }
  };

  // Fetch admin proposals when component mounts
  useEffect(() => {
    if (isConnected) {
      fetchAdminProposals();
    }
  }, [isConnected]);

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between pb-5">
        <h1 className="text-2xl text-gray-800 font-bold flex gap-2">
          <FaClipboardList className="text-blue-600" />
          Proposals : Add New Admin
        </h1>
        <button
          onClick={fetchAdminProposals}
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
        <div className="text-center text-blue-500 text-lg flex items-center justify-center gap-2">
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

      {!loading && !error && adminProposals.length === 0 && (
        <div className="flex items-center justify-center p-6 bg-yellow-100 text-yellow-700 rounded-lg border-l-4 border-yellow-500">
          <p className="font-semibold">No pending admin proposals found.</p>
        </div>
      )}

      {!loading && !error && adminProposals.length > 0 && (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-gray-200">
              <tr className="border-b border-gray-300">
                <th className="p-4 font-semibold text-gray-700">#</th>
                <th className="p-4 font-semibold text-gray-700">Proposed Admin Address</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminProposals.map((proposalAddr, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-4 text-gray-600 font-medium">{index + 1}</td>
                  <td className="p-4 font-mono text-sm text-gray-700 truncate max-w-xs">
                    {proposalAddr}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md flex items-center gap-1"
                        onClick={() => approveAdmin(proposalAddr)}
                      >
                        <FaCheckCircle />
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md flex items-center gap-1"
                        onClick={() => cancelAdminProposal(proposalAddr)}
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