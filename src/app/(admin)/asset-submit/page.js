"use client";

import { useEffect, useState } from "react";
import { writeContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import RWAFactoryAbi from "./../../../abi/RWAFactory";
import { RWA_FACTORY_CONTRACT, toWei } from "./../../../components/const";

import { FaSpinner, FaPlusCircle, FaTrash, FaCheckCircle, FaExclamationTriangle,  FaFileAlt } from "react-icons/fa";
import { getData } from '@/components/utils';

// Define the Document structure for clarity
const initialDocument = { docType: "", docURI: "" };

// Utility component for displaying static/fetched data nicely
const StaticField = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-500 mb-1">{label}</label>
    <div className="bg-white p-3 border border-gray-200 rounded-lg text-gray-800 break-words font-mono text-sm">
      {value || 'N/A'}
    </div>
  </div>
);

// Utility component for form inputs
const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required = false, className = "" }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full bg-white p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 ${className}`}
      required={required}
    />
  </div>
);


export default function SubmitAssetForm() {
  
  // Use a ref or state to handle the 'id' from URL params
  const [assetId, setAssetId] = useState(0); 


  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    symbol: "",
    supply: "",
    token_uri: "",
    token_standard: "",
    token_address: "",
    destination_wallet: "",
    documents: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to fetch asset details
  const fetchAssetDetail = async (idToFetch) => {
    if (!idToFetch || idToFetch === "0") return;

    try {
      setLoading(true);
      setError(null);
      const url = '/api/assets/' + idToFetch;
      const result = await getData(url);
      setLoading(false);

      // Map API result to formData structure
      const newDocuments = [];

      // Check and push existing documents from the fetched result
      if (result.ownership_declaration) {
        newDocuments.push({ docType: "Ownership Declaration", docURI: result.ownership_declaration });
      }
      if (result.revenue_distribution) {
        newDocuments.push({ docType: "Revenue Distribution", docURI: result.revenue_distribution });
      }
      if (result.tokenization_whitepaper) {
        newDocuments.push({ docType: "Tokenization Whitepaper", docURI: result.tokenization_whitepaper });
      }
      if (result.buyback_policy) {
        newDocuments.push({ docType: "Buyback Policy", docURI: result.buyback_policy });
      }
      if (result.ddl_agreement) { // Assuming ddl_agreement maps to default_dispute_liquidation_agreement
        newDocuments.push({ docType: "Default/Dispute/Liquidation Agreement", docURI: result.ddl_agreement });
      }

      setFormData({
        id: result.id,
        name: result.asset_name || "",
        symbol: result.token_symbol || "",
        supply: result.total_supply?.toString() || "", // Ensure supply is a string for the input field
        token_uri: result.token_uri || "",
        token_standard: result.token_standard || "",
        token_address: result.token_address || "",
        destination_wallet: result.destination_wallet || "",
        documents: newDocuments.length > 0 ? newDocuments : [initialDocument], // Initialize with one empty document if none exist
      });
    } catch (err) {
      setLoading(false);
      setError(`Failed to fetch asset details: ${err.message}`);
    }
  };

  // useEffect to get 'id' from URL and fetch data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    
    // Set the ID and then fetch the details
    if(idParam) {
        setAssetId(idParam);
        fetchAssetDetail(idParam);
    } else {
        // Initialize documents if no ID is present (for a new submission)
        setFormData(prev => ({ ...prev, documents: [initialDocument] }));
    }
  }, []);

  // Handle standard input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle document changes
  const handleDocumentChange = (index, field, value) => {
    const newDocs = [...formData.documents];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setFormData({ ...formData, documents: newDocs });
  };

  // Add new document row
  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, initialDocument],
    });
  };

  // Remove document row
  const removeDocument = (index) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocs });
  };

  // Database sync function
  // const updateAssetInformationInDatabase = async (id) => {
  //   try {
  //     const url = `${apiUrl}/api/assets/sync?id=${id}`;
  //     await fetch(url);
  //     console.log(`Asset ID ${id} synced with database.`);
  //   } catch (e) {
  //     console.error("Failed to sync asset info to database:", e);
  //   }
  // };

  // Submit asset info to contract
  const submitAssetInfo = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    // Filter out empty document entries
    const validDocuments = formData.documents.filter(doc => doc.docType && doc.docURI);
    
    if (validDocuments.length === 0) {
        setError("Please add at least one valid Document Type and URI.");
        return;
    }

    try {
      setLoading(true);
      const _tokenStandardEnum = {
        "ERC20":0,
        "ERC721":1,
        "ERC1155":2
      }

      const tokenStandard = parseInt(_tokenStandardEnum[formData.token_standard]);
      const supply =  tokenStandard==0 ? toWei(formData.supply) : formData.supply;

      alert(JSON.stringify({
          id:formData.id,
          name:formData.name,
          symbol:formData.symbol,
          supply:formData.supply, 
          token_uri:formData.token_uri,
          tokenStandard,
          validDocuments,
          contractAddress:RWA_FACTORY_CONTRACT
      }));

      const txHash = await writeContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAFactoryAbi,
        functionName: "submitAssetInfo",
        args: [
          BigInt(formData.id), // Ensure ID is BigInt if required by contract
          formData.name,
          formData.symbol,
          supply, 
          formData.token_uri,
          tokenStandard,
          validDocuments, // struct array
        ],
      });

      console.log("Transaction sent:", txHash);
      setSuccess(`Asset data submitted to contract! Transaction Hash: ${txHash}`);
      
      // Clear sensitive form data after successful submission
      setFormData(prev => ({
        ...prev,
        name: "",
        symbol: "",
        supply: "",
        token_uri: "",
        documents: [initialDocument],
      }));
      
    } catch (err) {
      console.error("Error submitting asset:", err);
      setError(err.message || "Failed to submit asset information to the contract.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl  my-12 p-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4">
        {assetId ? `${formData.name || 'Loading...'}` : "Submit New Asset"} 🪙
      </h1>

      {/* --- Notification Area --- */}
      {error && (
        <div className="flex items-start p-4 mb-4 bg-red-50 text-red-800 rounded-xl border border-red-200">
            <FaExclamationTriangle className="mt-1 mr-3 text-xl flex-shrink-0" />
            <div>
                <strong className="font-semibold">Submission Error:</strong> {error}
            </div>
        </div>
      )}
      {success && (
        <div className="flex items-start p-4 mb-4 bg-green-50 text-green-800 rounded-xl border border-green-200">
            <FaCheckCircle className="mt-1 mr-3 text-xl flex-shrink-0" />
            <div>
                <strong className="font-semibold">Success!</strong> {success}
            </div>
        </div>
      )}

      <form onSubmit={submitAssetInfo} className="space-y-8">
        
        {/* --- Asset Details Section --- */}
        <section className="p-6 bg-gray-50 rounded-xl shadow-inner space-y-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                Asset & Token Details
            </h2>

            {/* Read-Only/Fetched Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StaticField label="Database ID" value={formData.id} />
                <StaticField label="Token Standard" value={formData.token_standard} />
            </div>

            <StaticField label="Destination Wallet" value={formData.destination_wallet} />
            <StaticField label="Deployed Token Address" value={formData.token_address} />
            

            {/* Editable Submission Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                    label="Asset Name"
                    name="name"
                    placeholder="e.g., Manhattan Real Estate"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Token Symbol"
                    name="symbol"
                    placeholder="e.g., MRE"
                    value={formData.symbol}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Max Supply"
                    name="supply"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={formData.supply}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <FormInput
                label="Token URI (Metadata)"
                name="token_uri"
                placeholder="https://ipfs.io/ipfs/..."
                value={formData.token_uri}
                onChange={handleChange}
                required
                className="font-mono text-sm"
            />
        </section>

        {/* --- Documents Section --- */}
        <section className="p-6 bg-gray-50 rounded-xl shadow-inner space-y-4">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                <FaFileAlt className="mr-2" /> Supporting Documents (on-chain metadata)
            </h2>

            {/* Document List */}
            {Array.isArray(formData.documents) && formData.documents.map((doc, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row gap-3 p-4 border border-blue-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Document Type</label>
                        <input
                            type="text"
                            placeholder="e.g., Ownership Declaration"
                            value={doc.docType}
                            onChange={(e) => handleDocumentChange(index, "docType", e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Document URI</label>
                        <input
                            type="text"
                            placeholder="https://ipfs.io/ipfs/..."
                            value={doc.docURI}
                            onChange={(e) => handleDocumentChange(index, "docURI", e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg font-mono text-sm focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex items-end pb-1">
                        <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors rounded-full"
                            aria-label={`Remove document ${index + 1}`}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
            
            {/* Add Document Button */}
            <button
                type="button"
                onClick={addDocument}
                className="flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 font-semibold p-2 rounded-lg transition-colors"
            >
                <FaPlusCircle className="text-lg" />
                Add Document
            </button>
        </section>

        {/* --- Submission Button --- */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-3 transition-all duration-300 transform hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-2xl" /> 
              Submitting to Contract...
            </>
          ) : (
            "Submit Asset Data On-Chain"
          )}
        </button>
      </form>
    </div>
  );
}