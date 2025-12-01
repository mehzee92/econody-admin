"use client";

import { useState } from "react";
import { writeContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import RWAAbi from "./RWAAbi.json";
import { RWA_FACTORY_CONTRACT } from "./../../../components/const";
import { FaSpinner } from "react-icons/fa";

export default function SubmitAssetForm() {
  const [formData, setFormData] = useState({
    standard: "ERC721",
    name: "",
    symbol: "",
    supply: "",
    baseUri: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit asset info to contract
  const createERC721 = async () => {
    try {
      setLoading(true);
      setError(null);
      const txHash = await writeContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAAbi,
        functionName: "createERC721",
        args: [
          formData.name,
          formData.symbol,
          BigInt(formData.supply),
          formData.baseUri,
        ],
      });
      console.log("Transaction sent:", txHash);
      alert(`Asset submitted! TxHash: ${txHash}`);
      setFormData({
        standard: "ERC721",
        name: "",
        symbol: "",
        supply: "",
        baseUri: "",
      });
    } catch (err) {
      console.error("Error submitting asset:", err);
      setError("Failed to submit asset info.");
    } finally {
      setLoading(false);
    }
  };

  const createERC1155 = async () => {
    try {
      setLoading(true);
      setError(null);
      const txHash = await writeContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAAbi,
        functionName: "createERC1155",
        args: [formData.name, formData.symbol, formData.baseUri],
      });
      alert(`Asset submitted! TxHash: ${txHash}`);
      setFormData({
        standard: "ERC721",
        name: "",
        symbol: "",
        supply: "",
        baseUri: "",
      });
    } catch (err) {
      console.error("Error submitting asset:", err);
      setError("Failed to submit asset info.");
    } finally {
      setLoading(false);
    }
  };

  function createNft(e) {
    e.preventDefault();

    alert(JSON.stringify(formData.standard));

    if (formData.standard === "ERC1155") {
      createERC1155(formData.name, formData.symbol, formData.baseURI);
    }
    if (formData.standard === "ERC721") {
      createERC721(formData.name, formData.symbol, formData.supply, formData.baseURI);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-1 p-6 bg-white shadow-lg rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Create NFT
      </h2>

      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
          {error}
        </div>
      )}

      <form onSubmit={createNft} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Standard</label>
          <select
            name="standard"
            value={formData.standard}
            onChange={handleChange}
            className="w-full bg-gray-50 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          >
            <option value="ERC721">ERC721</option>
            <option value="ERC1155">ERC1155</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Asset Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-50 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
          <input
            type="text"
            name="symbol"
            placeholder="Asset Symbol"
            value={formData.symbol}
            onChange={handleChange}
            className="w-full bg-gray-50 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            required
          />
        </div>


      {
        formData.standard=="ERC721" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Supply</label>
            <input
              type="number"
              name="supply"
              placeholder="Supply"
              value={formData.supply}
              onChange={handleChange}
              className="w-full bg-gray-50 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
              required
            />
          </div>
        ) : null
      }


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base URI</label>
          <input
            type="text"
            name="baseUri"
            placeholder="baseUri"
            value={formData.baseUri}
            onChange={handleChange}
            className="w-full bg-gray-50 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Create NFT"}
        </button>
      </form>
    </div>
  );
}
