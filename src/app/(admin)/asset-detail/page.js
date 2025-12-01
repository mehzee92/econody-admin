"use client"
import { apiUrl } from "@/components/utils";
import { useEffect, useState } from "react";


function Page()
{
    // State to hold the asset ID from the URL and the fetched asset details
    const [id, setId] = useState();
    const [detail, setDetail] = useState(null); // Initialize with null for clearer conditional rendering/checks

    /**
     * Fetches asset details from the API.
     * @param {string} assetId The ID of the asset to fetch.
     */
    const fetchAssetDetail = async (assetId) => {
        if (!assetId) return; // Guard clause if ID is not available

        try {
            const url = `${apiUrl}/api/assets/asset-detail?id=${assetId}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setDetail(data);
            // alert(JSON.stringify(data)); // Keep the original alert logic
        } catch (error) {
            console.error("Error fetching asset detail:", error);
            // Optionally set an error state here
        }
    };


    useEffect(() => {
        const url = window.location.href;
        const params = new URLSearchParams(new URL(url).search);
        const _id = params.get("id");

        if (_id) {
            setId(_id);
            fetchAssetDetail(_id);
        }
    }, []); 


    /**
     * Renders a detail row, handling regular values and link values differently.
     * This version keeps the label and value on the same line.
     * * @param {object} props
     * @param {string} props.label - The display label for the row.
     * @param {string} props.value - The value (string) to display.
     * @param {boolean} [props.isDocument=false] - If true, the value is treated as a clickable document link.
     */
    const DetailRow = ({ label, value, isDocument = false }) => {
        // Only render the row if a value is present
        if (!value) return null;

        const content = isDocument ? (
            <a
                href={`${apiUrl}/uploads/${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
                title={`Open document: ${value}`}
            >
                {value}
            </a>
        ) : (
            <span className="text-gray-900 break-all">{value}</span>
        );

        return (
            // Using flex to keep elements on one line.
            <div className="py-2 border-b border-gray-100 flex">
                {/* Label container, given fixed width to align all labels and allow value to wrap */}
                <div className="font-medium text-gray-600 flex-shrink-0 w-48">{label} :</div>
                
                {/* Value container, takes up remaining space and wraps text */}
                <div className="flex-grow min-w-0">{content}</div> 
            </div>
        );
    };

    // Loading state check
    if (detail === undefined) {
        return <div className="p-5 text-center text-lg">Loading asset details...</div>;
    }

    return (
        <div className="p-6 show ">

            <h1 className="text-4xl font-bold mb-6 text-indigo-700">Asset Detail</h1>
            
            <div className="space-y-6">

                {/* --- Asset Identity & Images --- */}
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
                    <div className="flex-shrink-0">
                        <img
                            style={{ width: "60px", height: "60px", backgroundColor: "gray", border: "solid 2px #E5E7EB", borderRadius: "50%" }}
                            src={detail?.token_icon ? `${apiUrl}/uploads/${detail?.token_icon}` : '/placeholder-icon.png'}
                            alt="Token Icon"
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">{detail?.asset_name || "N/A"}</h2>
                        <p className="text-sm text-gray-500">Symbol: {detail?.token_symbol || "N/A"}</p>
                    </div>
                </div>
                
                {/* Marketplace Thumbnail */}
                <div className="pt-4">
                    <p className="font-medium text-gray-600 mb-2">Marketplace Thumbnail:</p>
                    <img
                        style={{ width: "180px", height: "120px", backgroundColor: "gray", border: "solid 1px #D1D5DB" }}
                        src={detail?.thumbnail ? `${apiUrl}/uploads/${detail?.thumbnail}` : '/placeholder-thumbnail.png'}
                        alt="Marketplace Thumbnail"
                        className="object-cover rounded-md"
                    />
                </div>
                
                {/* --- Core Details Section --- */}
                <h3 className="text-2xl font-semibold pt-4 border-t border-gray-200 text-indigo-600">Core Information</h3>
                <div className="space-y-2"> 
                    <DetailRow label="Asset ID" value={id} />
                    <DetailRow label="Category" value={detail?.category} />
                    <DetailRow label="Status" value={detail?.status} />
                    <DetailRow label="Created On" value={detail?.created_on} />
                    <DetailRow label="Total Supply" value={detail?.total_supply} />
                    <DetailRow label="Marketplace Title" value={detail?.title} />
                    <DetailRow label="Description" value={detail?.description} />

                </div>
                
                
                {/* --- Token/Blockchain Details Section --- */}
                <h3 className="text-2xl font-semibold pt-6 border-t border-gray-200 text-indigo-600">Blockchain Details</h3>
                <div className="space-y-2">
                    <DetailRow label="Token Standard" value={detail?.token_standard} />
                    <DetailRow label="Token Address" value={detail?.token_address} />
                    <DetailRow label="Token ID" value={detail?.token_id} />
                    <DetailRow label="Token URI" value={detail?.token_uri} />
                    <DetailRow label="Destination Wallet" value={detail?.destination_wallet} />
                </div>

                {/* --- Legal/Policy Details Section --- */}
                <h3 className="text-2xl font-semibold pt-6 border-t border-gray-200 text-indigo-600">Legal & Policy Documents</h3>
                <div className="space-y-2">
                    <DetailRow label="Legal Owner" value={detail?.legal_owner} />
                    <DetailRow label="Issuer Entity" value={detail?.issuer_entity} />
                    
                    {/* Documents/Links - Use isDocument={true} */}
                    <DetailRow 
                        label="Revenue Distribution" 
                        value={detail?.revenue_distribution} 
                        isDocument={true} 
                    />
                    <DetailRow 
                        label="Tokenization Whitepaper" 
                        value={detail?.tokenization_whitepaper} 
                        isDocument={true} 
                    />
                    <DetailRow 
                        label="Buyback Policy" 
                        value={detail?.buyback_policy} 
                        isDocument={true} 
                    />
                    <DetailRow 
                        label="Ownership Declaration" 
                        value={detail?.ownership_declaration} 
                        isDocument={true} 
                    />
                    <DetailRow 
                        label="Dispute, Liquidation Agreement" 
                        value={detail?.ddl_agreement} 
                        isDocument={true} 
                    />
                </div>
            </div>
        </div>
    );
}

export default Page;