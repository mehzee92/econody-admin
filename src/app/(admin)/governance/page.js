"use client";

import { useState } from "react";
// import { getAccount, readContract, writeContract } from "@wagmi/core";
// import { config } from "./../../wagmi";
// import contractABI from "./GovernanceContract.json";
// import Link from 'next/link'
import AddAdmin from "./AddAdmin";
import RevokeAdmin from "./RevokeAdmin";
import AddManager from "./AddManager";
import RevokeManager from "./RevokeManager";
import GetAdmins from "./GetAdmins"
import GetManagers from "./GetManagers"
import InitAdmin from "./InitAdmin"
import InitManager from "./InitManager"


export default function AdminProposals() 
{
  const [activeTab, setActiveTab] = useState("getAdmins");
  // const [account, setAccount] = useState(null);
  // const [isConnected, setIsConnected] = useState(false);
  // const [managerAddProposal, setManagerAddProposal] = useState([]);
  // const [managerRevokeProposal, setManagerRevokeProposal] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  const tabs = [
    { id: "getAdmins", name: "All Admins", component: GetAdmins },
    { id: "approveAdmin", name: "Init New Admin", component: InitAdmin },    
    { id: "getManagers", name: "All Managers", component: GetManagers },
    { id: "approveManager", name: "Init New Manager", component: InitManager },
    { id: "addAdmin", name: "Approve Add Admin", component: AddAdmin },
    { id: "revokeAdmin", name: "Approve Revoke Admin", component: RevokeAdmin },
    { id: "addManager", name: "Approve Add Manager", component: AddManager },
    { id: "revokeManager", name: "Approve Revoke Manager", component: RevokeManager }
  ];

  const CurrentComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex bg-gray-50 min-h-screen p-6 font-sans">
      {/* Sidebar for Navigation */}
      <div className="w-64 bg-white rounded-lg shadow-xl p-6 flex flex-col space-y-4">
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


     <div className="flex-1 ml-6 bg-white rounded-lg shadow-xl p-2">
          {CurrentComponent && <CurrentComponent />}
      </div>
    </div>
  );
}
