'use client';
import { useEffect, useState } from 'react';
import { writeContract, readContract } from "@wagmi/core";
import { config } from "./../../wagmi";
import RWAFactoryAbi from "./../../../abi/RWAFactory";
import { RWA_FACTORY_CONTRACT } from "./../../../components/const";
import { FaClipboardList, FaSpinner } from 'react-icons/fa';
import { apiUrl } from '@/components/utils';
import { toEth } from "./../../../components/const";



  // const getAllDeployedTokens = async(token) => {
  //   const standard = {
  //     "0":"ERC20",
  //     "1":"ERC721",
  //     "2":"ERC1155"
  //   };

  //   try {
  //     const result = await readContract(config, {
  //       address: RWA_FACTORY_CONTRACT,
  //       abi: RWAAbi,
  //       functionName: "getAllDeployedTokens",
  //     });
  //     const resultFormated = result.map((row)=>{
  //        row.name = standard[row.name.toString()];
  //        if(row.standard != token) return; 
  //        return {
  //           contractAddress: row.contractAddress.toString(),
  //           name: row.name.toString(),
  //       }
  //     })
  //     return resultFormated;
  //   } 
  //   catch (err) 
  //   {
  //     console.error("Error submitting asset:", err);
  //   }
  // };


const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 pr-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const TimesCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 pr-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function AssetsPending() 
{

  const _tokenType = {
    "0":"ERC20",
    "1":"ERC721",
    "2":"ERC1155"
  };
  
  const [pendingAssets, setPendingAssets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [approvingAssetId, setApprovingAssetId] = useState();
  const [isApproving, ] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPendingAssets = async () => {
    setLoading(true);
    try {
      const result = await readContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAFactoryAbi,
        functionName: "getPendingAssets",
        args: [],
      });

      const resultf = result.map((row) => {
        return {
          id: row.id.toString(),
          name: row.name.toString(),
          symbol: row.symbol.toString(),
          supply: row.supply.toString(),
          tokenStandard: row.tokenStandard.toString(),
        };
      });
      setPendingAssets(resultf);
    } catch (err) {
      console.error("Error fetching admin proposals:", err);
      setError("Failed to fetch admin proposals.");
    }
    setLoading(false);
  };


  const approveAssetAndCreateERC20 = async (assetId, mintTo) => {
    try {
      const txHash = await writeContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAFactoryAbi,
        functionName: "approveAssetAndCreateERC20",
        args: [assetId, mintTo],
      });
      console.log("Rejection transaction sent:", txHash);
      await getPendingAssets();
    } catch (err) {
      console.error("Reject failed:", err);
      setError("Rejection transaction failed. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };



  const approveAssetAndMintERC721 = async (assetId, nftAddress, mintTo) => {
    try {
      const txHash = await writeContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAFactoryAbi,
        functionName: "approveAssetAndMintERC721",
        args: [assetId, nftAddress, mintTo],
      });
      console.log("Rejection transaction sent:", txHash);
      await getPendingAssets();
    } catch (err) {
      console.error("Reject failed:", err);
      setError("Rejection transaction failed. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };



          
  const approveAssetAndMintERC1155 = async (assetId, nftAddress, mintTo) => {
    try {
      const txHash = await writeContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAFactoryAbi,
        functionName: "approveAssetAndMintERC1155",
        args: [assetId, nftAddress, mintTo],
      });
      console.log("Rejection transaction sent:", txHash);
      await getPendingAssets();
    } catch (err) {
      console.error("Reject failed:", err);
      setError("Rejection transaction failed. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };



  const rejectAsset = async (assetId) => {
    setIsRejecting(true);
    setError('');
    try {
      const txHash = await writeContract(config, {
        address: RWA_FACTORY_CONTRACT,
        abi: RWAFactoryAbi,
        functionName: "rejectAsset",
        args: [assetId],
      });
      console.log("Rejection transaction sent:", txHash);
      await getPendingAssets();
    } catch (err) {
      console.error("Reject failed:", err);
      setError("Rejection transaction failed. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };


  const openModal = (_approvingAssetId) => {
    setApprovingAssetId(_approvingAssetId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setApprovingAssetId(null);
  };

  useEffect(() => {
    getPendingAssets();
  }, []);


  const ApprovalModal = ({assetId, getPendingAssets}) => {

    const [tokenType, setTokenType] = useState('ERC20');
    const [nftAddress, setNftAddress] = useState('');
    const [mintTo, setMintTo] = useState('');
    const [data, setData] = useState();
    const[loading, setLoading] = useState(false);

    const fetchAssetDetail=async(_id)=>
    {
      const url = apiUrl+"/api/assets/asset-detail?id="+_id;
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      setTokenType(data.token_standard);
      setNftAddress(data.token_address);
      setMintTo(data.destination_wallet);
    }


    useEffect(()=>{
      fetchAssetDetail(assetId)
    }, [assetId])

    const handleFormSubmit = async(e) => {
      e.preventDefault();
      setLoading(true);
      // For a real app, you would use these values in your contract call.
      // Here, we'll just log them and proceed with the mock approval.
      // console.log('Form Data:', { tokenType, nftAddress, mintTo });
      //  approveAsset(assetId);
    if(tokenType=='ERC20') {
        await approveAssetAndCreateERC20(assetId, mintTo)
    }
    
    if(tokenType=='ERC721') {
        await approveAssetAndMintERC721(assetId, nftAddress, mintTo)
    }  
    
    if(tokenType=='ERC1155') {
        await approveAssetAndMintERC1155(assetId, nftAddress, mintTo)
    }      
    getPendingAssets();
    setLoading(false);
    closeModal();

  };

    return (
      <div className="fixed  inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
        <div className="bg-white border border-1 border-gray-400 p-8 rounded-2xl shadow-2xl max-w-2xl w-full">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Approval</h3>

            <div className="mb-4 flex flex-1">
              <div htmlFor="tokenType" className="block text-lg font-medium text-gray-700 mb-1">
                Asset ID : 
              </div>
              <div className='font-bold px-2 text-lg'>{data?.id}</div>
            </div>        

          <div className="mb-4 flex flex-1">
            <div htmlFor="tokenType" className="block text-sm font-medium text-gray-700 mb-1">
              Name : 
            </div>
            <div className='font-bold px-2'>{data?.asset_name}</div>
          </div>

          <div className="mb-4 flex flex-1">
            <div htmlFor="tokenType" className="block text-sm font-medium text-gray-700 mb-1">
              Symbol : 
            </div>
            <div className='font-bold px-2'>{data?.token_symbol}</div>
          </div>

          <div className="mb-4 flex flex-1">
            <div htmlFor="tokenType" className="block text-sm font-medium text-gray-700 mb-1">
              Total Supply : 
            </div>
            <div className='font-bold px-2'>{data?.total_supply}</div>
          </div>  


          <div className='py-5'>
             <h3 className='font-bold'>Description</h3>
             {data?.description}
          </div>






            <div className="mb-4">
              <label htmlFor="tokenType" className="block text-sm font-medium text-gray-700 mb-1">Token Type</label>
              <input
                id="tokenType"
                name="tokenType"
                value={tokenType}
                onChange={() => {}}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm" />
            </div>

            {tokenType !== 'ERC20' && (
              <>
                <div className="mb-4">
                  <label htmlFor="nftAddress" className="block text-sm font-medium text-gray-700 mb-1">NFT Address</label>
                  <input
                    type="text"
                    id="nftAddress"
                    name="nftAddress"
                    value={nftAddress}
                    onChange={() => {}}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                </div>
              </>
            )}


            <div className="mb-4">
              <label htmlFor="mintTo" className="block text-sm font-medium text-gray-700 mb-1">Mint To Address</label>
              <input
                type="text"
                id="mintTo"
                name="mintTo"
                value={mintTo}
                onChange={() => {}}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                onClick={handleFormSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <SpinnerIcon /> Approving...
                  </>
                ) : (
                  'Confirm Approve'
                )}
              </button>
            </div>

        </div>
      </div>
    );
  };







  return (
    <>
      <div className="w-full min-h-screen px-4 py-8 md:px-10 bg-gray-50 ">
          <div className="flex pb-5">
            <h1 className="text-2xl text-gray-800 font-bold flex">
              <FaClipboardList className="text-blue-600" />
               Assets: Pending Approval
            </h1>
            <div className='flex-1'></div>
            <button
              onClick={getPendingAssets}
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


          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Token Standard</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Supply</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingAssets.length > 0 ? (
                  pendingAssets.map((asset) => (
                    <tr key={asset?.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset?.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ _tokenType[asset?.tokenStandard]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{asset?.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{parseInt(asset?.tokenStandard)==0 ? toEth(asset?.supply) : asset?.supply }</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md flex items-center gap-2 disabled:bg-green-400 disabled:cursor-not-allowed"
                            onClick={() => openModal(asset?.id)}
                            disabled={isApproving || isRejecting}
                          >
                            <CheckCircleIcon />
                            Approve
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md flex items-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                            onClick={() => rejectAsset(asset?.id)}
                            disabled={isApproving || isRejecting}
                          >
                            <TimesCircleIcon />
                            Reject
                          </button>
                          {(isApproving || isRejecting) && <SpinnerIcon />}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No pending assets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      {showModal && <ApprovalModal getPendingAssets={getPendingAssets}  assetId={approvingAssetId} />}
    </>
  );
}
