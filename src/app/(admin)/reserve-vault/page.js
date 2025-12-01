"use client";

import { useState } from "react";
// import { getAccount, readContract, writeContract } from "@wagmi/core";
// import { config } from "./../../wagmi";
// import ReserveVaultAbi from "@/abi/ReserveVault";
import RevenueDeposite from "./RevenueDeposite";
import UnclaimedReward from "./UnclaimedReward";
import RevenueHistory from "./RevenueHistory";


export default function AdminProposals() {
  const [activeTab, setActiveTab] = useState("RevenueDeposite");
  // const [account, setAccount] = useState(null);
  // const [isConnected, setIsConnected] = useState(false);
  // const [managerAddProposal, setManagerAddProposal] = useState([]);
  // const [managerRevokeProposal, setManagerRevokeProposal] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  const tabs = [
    { id: "RevenueDeposite", name: "Revenue Deposite", component: RevenueDeposite },
    { id: "UnclaimedReward", name: "UnclaimedReward", component: UnclaimedReward },    
    { id: "RevenueHistory", name: "Revenue Distribution History", component: RevenueHistory },    
  ];

  const CurrentComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex bg-gray-50 min-h-screen p-6 font-sans">
      {/* Sidebar for Navigation */}
      <div className="w-72 bg-white rounded-lg shadow-xl p-6 flex flex-col space-y-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 text-left rounded-lg font-medium transition-colors duration-200
              ${activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>


     <div className="flex-1 ml-6 show bg-white rounded-lg shadow-xl p-2">
          {CurrentComponent && <CurrentComponent />}
      </div>
    </div>
  );
}
